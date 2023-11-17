import { useEffect } from 'react';

export type DatEventType = 'datgui-togglePlay' | 'datgui-speed'

export class DatEvent extends Event {
  value: any;
  constructor(type: DatEventType, properties?: {}) {
    super(type);
    if (properties) Object.assign(this, properties);
  }
}

export const guiOptions = {
  togglePlay: () => {},
  speed: 1
}

export function addDatListener(type: DatEventType, callback: (e: DatEvent) => void) {
  addEventListener(type, callback)
}

export const DatGUI = () => {

  useEffect(() => {
    import('dat.gui').then(dat => {
      const gui = new dat.GUI();

      const dispatcher = (type: DatEventType) => (value: any) => dispatchEvent(new DatEvent(type, { value }))

      gui.add(guiOptions, 'togglePlay').name('▶⏸').onChange(dispatcher('datgui-togglePlay'))
      gui.add(guiOptions, 'speed', 0, 3).onChange(dispatcher('datgui-speed'))
    })
  })

  return null
}