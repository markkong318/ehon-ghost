import { randomRange } from './rand-util';

export function applyShake(obj, intensity = 1) {
  const x = randomRange(-5, 5) * intensity;
  const y = randomRange(-5, 5) * intensity;

  obj.x += x;
  obj.y += y;

  setTimeout(() => {
    obj.x -= x;
    obj.y -= y;
  }, randomRange(50, 150));
}
