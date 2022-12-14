import { TrackType, TuneflowPlugin, WidgetType } from 'tuneflow';
import type {
  InstrumentSelectorWidgetConfig,
  LabelText,
  ParamDescriptor,
  Song,
  SongAccess,
  TrackSelectorWidgetConfig,
} from 'tuneflow';

export class LayerMultiplier extends TuneflowPlugin {
  static providerId(): string {
    return 'andantei';
  }

  static pluginId(): string {
    return 'layer-multiplier';
  }

  static providerDisplayName(): LabelText {
    return {
      zh: 'Andantei行板',
      en: 'Andantei',
    };
  }

  static pluginDisplayName(): LabelText {
    return {
      zh: '音色叠加',
      en: 'Layer Multiplier',
    };
  }

  static pluginDescription(): LabelText | null {
    return {
      zh: '用一个不同音色的轨道来叠加选中轨道',
      en: 'Layer the selected track with a different instrument',
    };
  }

  params(): { [paramName: string]: ParamDescriptor } {
    return {
      trackId: {
        displayName: {
          zh: '原轨道',
          en: 'Track to layer',
        },
        defaultValue: undefined,
        widget: {
          type: WidgetType.TrackSelector,
          config: {
            alwaysShowTrackInfo: true,
            allowedTrackTypes: [TrackType.MIDI_TRACK],
          } as TrackSelectorWidgetConfig,
        },
      },
      instrument: {
        displayName: {
          zh: '叠加乐器',
          en: 'Layering instrument',
        },
        defaultValue: {
          program: 0,
          isDrum: false,
        },
        widget: {
          type: WidgetType.InstrumentSelector,
          config: {} as InstrumentSelectorWidgetConfig,
        },
      },
    };
  }

  public allowManualApplyAdjust(): boolean {
    return true;
  }

  songAccess(): SongAccess {
    return {
      createTrack: true,
    };
  }

  async run(song: Song, params: { [paramName: string]: any }): Promise<void> {
    const trackId = this.getParam<string>(params, 'trackId');
    const instrument = this.getParam<any>(params, 'instrument');
    const track = song.getTrackById(trackId);
    if (!track) {
      throw new Error('Track not ready');
    }
    const newTrack = song.cloneTrack(track);
    if (!newTrack) {
      return;
    }
    newTrack.setInstrument({
      program: instrument.program,
      isDrum: instrument.isDrum,
    });
  }
}
