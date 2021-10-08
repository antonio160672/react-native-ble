import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList
} from 'react-native'

import Layout from './bluetooth/components/bluetooth-list-layout';
import Empty from './bluetooth/components/empty';
import Togger from './bluetooth/components/togger';
import Form from './bluetooth/components/form';
import Subtitle from './bluetooth/components/subtitle';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { Button } from 'react-native-elements';
import Divice from './bluetooth/components/divice';
import { BleManager, Device, Service, Characteristic, Descriptor } from 'react-native-ble-plx';
import base64 from 'react-native-base64'
import RNFetchBlob from 'react-native-fetch-blob';
import Toast from 'react-native-simple-toast';


const manager = new BleManager();
const arraF = []
const dispo = [{
    id: 9,
    deviceID: "84:2F:7D:04:A1:7F"
}]
let expeNameG=""
const servicio = new Service();
function BluetoothList(props) {

    const [lista, setLista] = useState([])

    const [serviceble, setserviceBLE] = useState(servicio)
    const [man, setManager] = useState(manager);
    const [devi, setDevice] = useState(dispo);
    //const [descriptors, setDescriptors] = useState<Descriptor>([]); 

    const [expeName, setExperiment]= useState('')

    const [bolEnable, setBolEna] = useState(false)
    const renderEmpty = () => <Empty text='No hay dispositivos' />
    const renderItem = ({ item, index }) => {
        return <Divice
            {...item}
            iconLeft={require('./iconos/ic_laptop.png')}
            iconRight={require('./iconos/ic_settings.png')}
        />
    }


//modificar para conectar al dispositivo
    const scanAndConnect = async () => {
        console.log('do scanAndConnect');
        manager.startDeviceScan(null, null, async (error, device) => {
            console.log('scanning...');
            setManager(manager)
            if (error) {
                // Handle error (scanning will be stopped automatically)
                setAppState((prev) => ({ ...prev, deviceStatus: 'scan_error' }));
                console.log('Error while scanning', error);
                return;
            }

            if (device.id === dispo.deviceID) {//cambiar mac 
                manager.stopDeviceScan();
                console.log('scan stopped, connecting');

                device.connect()
                    .then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                        console.log('descriptorsForService', device);
                        const services = device.services(device.id)
                        return services;
                    }).then((services) => {
                        let characteristic = {};
                        services.forEach(async service => {
                            if (service.uuid === "19b10012-e8f2-537e-4f6c-d104768a1214") {
                                console.log("characteristic", typeof (device.characteristicsForService(service.uuid)))
                                characteristic = device.characteristicsForService(service.uuid);
                            }
                        });
                        return characteristic;
                    }).then((services) => {
                        let descriptorsForService = ""
                        services.forEach(async service => {
                            if (service.uuid === "19b10011-e8f2-537e-4f6c-d104768a1214") {
                                //const characteristics =  device.characteristicsForService(service.uuid);
                                descriptorsForService = device.descriptorsForService(service.serviceUUID, service.uuid);
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
                                console.log('funcion manager', manager);
                            }
                        });
                        device.monitorCharacteristicForService(
                            descriptors.serviceUUID,
                            descriptors.characteristicUUID,
                            async (err, update) => {
                                if (err) {
                                    console.log(`characteristic error: ${err}`);
                                    console.log(JSON.stringify(err));
                                } else {
                                    console.log("Se puede leer la característicae:", update.isReadable);
                                    if (update.isReadable) {
                                        console.log("Nombre del experiemto global", expeNameG);
                                        console.log("dato en basse 64", update.value);
                                        console.log("acelerometro:", base64.decode(update.value));
                                        var characteristic = base64.decode(update.value);
                                        var pieces = characteristic.split(",");
                                        pieces.push(expeNameG)
                                        console.log(pieces);
                                        arraF.push(pieces)
                                    }

                                }
                            }
                        )
                        //servicemonitorCharacteristic()
                        //manager.cancelDeviceConnection("84:2F:7D:04:A1:7F")
                        return;
                        //when this ends
                    })
                    .catch((error) => {
                        // Handle errors
                    });
            }
        });
    };


    const csvdata = async () => { 
        // construct csvString
        const headerString = 'X-acele,Y-acele, Z-acele, Experimento\n';
        const rowString = arraF.map(d => `${d[0]},${d[1]},${d[2]},${d[3]}\n`).join('');
        const csvString = `${headerString}${rowString}`;

        // write the current list of answers to a local csv file
        //const pathToWrite = "/storage/emulated/0/Android/data/com.ejemplo/files/experimento.csv";
        
        const pathToWrite = "/storage/emulated/0/Download/data.csv";
        console.log('pathToWrite', pathToWrite);
        // pathToWrite /storage/emulated/0/Download/data.csv
        RNFetchBlob.fs
            .writeFile(pathToWrite, csvString, 'utf8')
            .then(() => {
                console.log(`wrote file ${pathToWrite}`);
                // wrote file /storage/emulated/0/Download/data.csv
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        function init() {
            setLista(dispo)
            //setBolEna(enable)
            manager.onStateChange((state) => {
                const subscription = manager.onStateChange((state) => {
                    if (state === 'PoweredOn') {
                        scanAndConnect();
                        subscription.remove();
                    }
                }, true);
                return () => subscription.remove();
            });
        }
        init()
        return () => {
            async function remove() {
                await BluetoothSerial.stopScanning()
                console.log('Termino el escaneo')
            }
            remove()
        }
    }, [manager])

    const enableBluetooth = async () => {
        if(expeName.length > 0){
            try {
                await BluetoothSerial.requestEnable()
                expeNameG=expeName
                //const lista = await BluetoothSerial.list()
                ///await BluetoothSerial.stopScanning()
                setLista(dispo)
                setBolEna(true)
            } catch (error) {
                console.log(error)
            }
        }else{
            Toast.show('Favor de ingresar el nombre el experimeto', Toast.LONG);  
        }
    }

    const disableBluetooth = async () => {
        try {
            await BluetoothSerial.disable()
            await BluetoothSerial.stopScanning()
            setBolEna(false)
            setLista([])
        } catch (error) {
            console.log(error)
        }
    }

    const toggleBluetooth = value => {
        if (value) {
            return enableBluetooth()
        }
        disableBluetooth();
    }

    const clickButton = () => { 
        expeNameG=expeName
        console.log(expeNameG)

        if(expeName.length > 0){
            Toast.show('Experimento guardado');  
        }else{
            Toast.show('Favor de ingresar el nombre el experimeto', Toast.LONG);  
        }         
    }

    const disconect = () => {
        arraF.pop()
        console.log("entro a la desconexion");
        man.cancelDeviceConnection("84:2F:7D:04:A1:7F")
        console.log("data:", arraF);
        csvdata()
    }

    return (
        <Layout title='Bluetooth'>
            <Togger
                value={bolEnable}
                onValueChange={toggleBluetooth}
            />
            <Form
                onPress={clickButton}
                onChangeText={(text) => setExperiment(text)}
            />
            {bolEnable && (
                <Button
                    onPress={disconect}
                    title="Terminar experimentación"
                    type="Outline"
                />
            )}
            <Subtitle title="Lista de Dispositivos" />
            {bolEnable && (
                <FlatList
                    ListEmptyComponent={renderEmpty}
                    data={lista}
                    renderItem={
                        renderItem
                    }
                />
            )}

        </Layout>

    )
}
export default BluetoothList;