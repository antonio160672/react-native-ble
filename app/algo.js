if (device.id === "84:2F:7D:04:A1:7F") {
    manager.stopDeviceScan();
    console.log('scan stopped, connecting');

    device.connect()
        .then((device) => {
            return device.discoverAllServicesAndCharacteristics()
        })
        .then((device) => {
            console.log('descriptorsForService', device);
            addDevice(device)
            const services =  device.services(device.id) 
            return services;
        }).then((services) => {
            let characteristic={};
            services.forEach(async service => {
                if (service.uuid === "19b10012-e8f2-537e-4f6c-d104768a1214") {
                    console.log("characteristic",typeof(device.characteristicsForService(service.uuid)))
                    characteristic = device.characteristicsForService(service.uuid);
                }
            });
            return characteristic;
        }).then((services) => { 
            let descriptorsForService=""
            services.forEach(async service => {
                if (service.uuid === "19b10011-e8f2-537e-4f6c-d104768a1214") {
                    //const characteristics =  device.characteristicsForService(service.uuid);
                    descriptorsForService= device.descriptorsForService(service.serviceUUID, service.uuid);
                    console.log('descriptorsForService 1', descriptorsForService);
                    
                }
            });
            return descriptorsForService;
        }).then((descriptorsForService) => {
            let descriptors = "";
            descriptorsForService.forEach(async service => {
                if (service.characteristicUUID === "19b10011-e8f2-537e-4f6c-d104768a1214") {
                    descriptors = service
                    console.log("descriptors", descriptors);
                    setserviceBLE(descriptors=>descriptors)
                    console.log('funcion manager', manager);
                    setManager(manager)
                    //setDevice
                    //setManager(manager)
                }
            }); 
            servicemonitorCharacteristic() 
                //manager.cancelDeviceConnection("84:2F:7D:04:A1:7F")
            return;
            //when this ends
        })
        .catch((error) => {
            // Handle errors
        });
}