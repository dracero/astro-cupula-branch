import { useEffect } from 'react';

export const guiOptions = {
  test: () => console.log("dat GUI test"),
}

export const DatGUI = () => {

  useEffect(() => {
    import('dat.gui').then(dat => {
      const gui = new dat.GUI();

      gui.add(guiOptions, 'test')
    })
  })

  return null
}