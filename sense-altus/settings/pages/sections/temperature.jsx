export function temperature(props) {
    return (
        <Section
          title={<Text bold align="center">Temperature Settings</Text>}>
          <Text>
            The international altitude formula is used as standard to calculate the height above sea level. 
            This uses a temperature constant (15°C). The barometric formula can abe used to potentially increase the accuracy of the result.
            This formula requires the entry of the current temperature.
          </Text>
          <Toggle
            settingsKey="isTemperatureEnabled"
            label="Enable Custom Temperature"
          />
          <TextInput
            settingsKey="temperature"
            label="Current Temperature"
            type="number"
            disabled={!(props.settings.isTemperatureEnabled === "true")}
            placeholder="15°C"
          />
        </Section>
    );
}