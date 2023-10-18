import React, { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'obsidian';
import PadScope from 'src/Math/PadScope';
import { MathpadSettings } from 'src/MathpadSettings';

//cfr: https://mauriciopoppe.github.io/function-plot/

export interface FunctionPlotProps {
    options?: any,
    onScaleChanged?: (options: any) => void
}

export const Plot: React.FC<FunctionPlotProps> =
    React.memo(({ options, onScaleChanged }:
        {
            options: any,
            onScaleChanged: (options: any) => void
        }) => {
        const rootEl = useRef<HTMLDivElement>(null);

        const [state] = useState(options);

        const handleScaleChanged = debounce(useCallback((options: any)=>{
            onScaleChanged && onScaleChanged(options);
        },[onScaleChanged]),300);

        useEffect(() => {
            try {
                if (rootEl.current) {
                    Object.assign(state, options);
                    state.target = rootEl.current;
                }
            } catch (e) {
                //
            }
        }, [options, handleScaleChanged])

        return (<div ref={rootEl} />)
    }, () => false);

export default Plot;

export function getPlotOptions(width: number, settings:MathpadSettings, padScope: PadScope) : any {
    
    const plotDerivatives = settings.plotDerivatives && (padScope.fn.length === padScope.dfn?.length);
    
    const data:any[] = padScope.fn.map((fn,i) => ({
        graphType: 'polyline',
        fn: (scope: any) => fn(scope.x),
        // nSamples: 4096, 
        derivative: plotDerivatives ? {
            fn: (scope: any) => padScope.dfn[i](scope.x),
            updateOnMouseMove: true
        } : undefined
    }))
    const dataPoints: any[] = padScope.points.map((serie,i)=>(
        {
            graphType: 'scatter',
            fnType: 'points',
            points: serie
        }
    ))


    return ({
        width: width,
        grid: settings.plotGrid,
        data: data.concat(dataPoints),
        xAxis: padScope.plot.xDomain && padScope.plot.xDomain.length == 2 && { domain: padScope.plot.xDomain },
        yAxis: padScope.plot.yDomain && padScope.plot.yDomain.length == 2 && { domain: padScope.plot.yDomain },
        target: "", // just to make tslint happy
        
    });
}

export function makePlot(cxt: any, padScope: PadScope, settings: MathpadSettings, handlePlotScaleChanhed?: (opts: any) => void): React.ReactNode {
    return <div className="mathpad-plot">
        <Plot 
        options={getPlotOptions(cxt.width - 20, settings, padScope)}
        onScaleChanged={handlePlotScaleChanhed}
        />
    </div>;
}
