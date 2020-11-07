import { colors } from './sections/color';
import { temperature } from './sections/temperature';

export function altusSettings(props) {
    return (
      <Page>
        {colors(props)}
        {temperature(props)}
      </Page>
    );
}