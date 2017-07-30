import theme from './theme.json';

export function getContrast(strong = true) {
  return strong ? theme.primary : theme.textInverted;
}

export function getColor(props, foreground = true) {
  const {
    secondary,
    inverted,
  } = props;
  const realInversion = foreground ? inverted : !inverted;
  const strong = realInversion ? getContrast(true) : getContrast(false);
  const weak = realInversion ? getContrast(false) : getContrast(true);
  return secondary ? weak : strong;
}