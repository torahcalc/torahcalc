import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.freshidea.newtorahcalc',
	appName: 'TorahCalc',
	webDir: 'build',
	server: {
		androidScheme: 'https',
	},
};

export default config;
