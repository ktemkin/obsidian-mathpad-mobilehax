import MathpadPlugin from "src/main";
import { App, PluginSettingTab, Setting } from "obsidian";


export class MathpadSettingsTab extends PluginSettingTab {
	plugin: MathpadPlugin;

	constructor(app: App, plugin: MathpadPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Mathpad Settings'});

        this.createToggle(containerEl, "Add Ribbon Icon",
            "Adds an icon to the ribbon to launch scan",
            "addRibbonIcon"
        );

        this.createToggle(containerEl, "Show Mathpad Sidebar",
        "Opens Mathpad sidebar at startup",
        "showAtStartUp"
    );

        this.createToggle(containerEl, "Prefer Block LaTeX",
            "Prefer LaTeX block to inline LaTeX",
            "preferBlock"
        );
        this.createToggle(containerEl, "Evaluate Results",
            "Evaluates expressions in order to obtain a numeric result",
            "evaluate"
        );

        this.createToggle(containerEl, "Plot Grid",
            "Displays grid lines in plots",
            "plotGrid"
        );

        new Setting(containerEl)
        .setName("Plot Width")
        .setDesc("Width of plots inside notes")
        .addText(tc=>tc
            .setValue(this.plugin.settings.plotWidth.toString())
            .onChange(async (value)=>{
                const num = Number(value) ;
                this.plugin.settings.plotWidth = num || 0;
                await this.plugin.saveSettings();
                
            })
            );
        this.createToggle(containerEl, "Plot Tangents",
            "Plots tangents to functions",
            "plotDerivatives"
        );
	}

    private createToggle(containerEl: HTMLElement, name: string, desc: string, prop: string) {
		new Setting(containerEl)
			.setName(name)
			.setDesc(desc)
			.addToggle(bool => bool
				.setValue((this.plugin.settings as any)[prop] as boolean)
				.onChange(async (value) => {
					(this.plugin.settings as any)[prop] = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);
	}
}
