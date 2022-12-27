import { base_accessory } from "./base_accessory";
import { HomebridgePlatform } from '../HomebridgePlatform'
import { PlatformAccessory, Categories, CharacteristicValue, Service } from 'homebridge'
import { IDevice } from '../ts/interface/IDevice'
import { ECapability } from "../ts/enum/ECapability";
import deviceUtils from "../utils/deviceUtils";

export class water_detector_accessory extends base_accessory {
	public state: {
		water: boolean,
		battery: number

	} = {
			water: false,
			battery: 30
		}

	service: Service | undefined
	batteryService: Service | undefined

	constructor(platform: HomebridgePlatform, accessory: PlatformAccessory | undefined, device: IDevice) {
		super(platform, accessory, Categories.SENSOR, device)
	}
	mountService(): void {
		this.service = this.accessory?.getService(this.platform.Service.LeakSensor) || this.accessory?.addService(this.platform.Service.LeakSensor);
		this.service?.getCharacteristic(this.platform.Characteristic.LeakDetected)
			.onGet(() => this.state.water)
			.onSet((value: CharacteristicValue) => {
				this.state.water = value as boolean;
				this.platform.log.info('--->', value)
			})

		if (deviceUtils.renderServiceByCapability(this.device, ECapability.BATTERY)) {
			this.batteryService = this.accessory?.getService(this.platform.Service.Battery) || this.accessory?.addService(this.platform.Service.Battery);
			this.batteryService?.getCharacteristic(this.platform.Characteristic.StatusLowBattery)
				.onGet(() => this.state.battery < 20 ? 1 : 0)

			this.batteryService?.getCharacteristic(this.platform.Characteristic.BatteryLevel)
				.onGet(() => this.state.battery)
				.onSet((value: CharacteristicValue) => {
					this.state.battery = value as number;
					this.platform.log.info('--->', value)
				})
		}
	}
	updateValue(params: any): void {

	}
}