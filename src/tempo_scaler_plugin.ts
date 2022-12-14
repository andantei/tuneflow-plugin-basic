import type { LabelText, ParamDescriptor, SliderWidgetConfig, Song } from 'tuneflow';
import { TuneflowPlugin, WidgetType } from 'tuneflow';

export class TempoScaler extends TuneflowPlugin {
  static providerId(): string {
    return 'andantei';
  }

  static pluginId(): string {
    return 'tempo-scaler';
  }

  static providerDisplayName(): LabelText {
    return {
      zh: 'Andantei行板',
      en: 'Andantei',
    };
  }

  static pluginDisplayName(): LabelText {
    return {
      zh: '播放速度',
      en: 'Playback Speed',
    };
  }

  static pluginDescription(): LabelText | null {
    return {
      zh: '按比率调整整首歌的播放速度',
      en: 'Adjust the playback speed of the whole song by a given ratio',
    };
  }

  params(): { [paramName: string]: ParamDescriptor } {
    return {
      scale: {
        displayName: {
          zh: '速率',
          en: 'Speed Ratio',
        },
        defaultValue: 100,
        widget: {
          type: WidgetType.Slider,
          config: {
            step: 10,
            minValue: 10,
            maxValue: 500,
            unit: '%',
          } as SliderWidgetConfig,
        },
        adjustableWhenPluginIsApplied: true,
      },
    };
  }

  async run(song: Song, params: { [paramName: string]: any }): Promise<void> {
    for (const tempoEvent of song.getTempoChanges()) {
      song.updateTempo(tempoEvent, (tempoEvent.getBpm() * params.scale) / 100);
    }
  }
}
