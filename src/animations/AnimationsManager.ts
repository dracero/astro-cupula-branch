import { Clock } from "../utils/Clock";

type MixerIndex = {
  mixer: THREE.AnimationMixer;
  speed: number;
  name: string;
};

export namespace AnimationsManager {
  const mixers: MixerIndex[] = [];

  export function add(mixer: THREE.AnimationMixer, name = "", speed = 1) {
    mixers.push({ mixer, name, speed });
  }

  export function edit(entryName: string, values: Partial<MixerIndex>) {
    const entry = mixers.find((entry) => entry.name == entryName);
    if (!entry) return;

    Object.keys(values).forEach((key) => (entry[key] = values[key]));
  }

  export function update() {
    mixers.forEach((entry) => {
      const { mixer, speed } = entry;
      mixer.update(Clock.delta * speed);
    });
  }
}
