import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Picker, Platform } from 'react-native';


const screen = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#07121B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderWidth: 10,
        borderColor: '#89AAFF',
        width: screen.width / 2,
        height: screen.width / 2,
        borderRadius: screen.width / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    buttonStop: {
        borderColor: '#FF851B'
    },
    buttonText: {
        fontSize: 45,
        color: "#89AAFF"
    },
    buttonStopText: {
        color: '#FF851B'
    },
    timerText: {
        color: '#fff',
        fontSize: 90
    },
    picker: {
        width: 50,
        fontSize: 50,
        ...Platform.select({
            android: {
                color: '#fff',
                backgroundColor: '#07121B',
                transform: [{ scaleX: 2.5 }, { scaleY: 2.5 }]
            }
        })
    },
    pickerItem: {
        color: '#fff',
        fontSize: 50,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 50
    }
});

// 3 => 03, 10 => 10
const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    console.log(time);
    return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
}


export default function App() {
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [selectedSeconds, setSelectedSeconds] = useState(0);
    const [selectedMinutes, setSelectedMinutes] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const { minutes, seconds } = getRemaining(remainingSeconds);
    let interval = null;

    useEffect(() => {
        if (isRunning) {
            if (remainingSeconds <= 0) stop();
            interval = setInterval(() => {
                setRemainingSeconds(remainingSeconds - 1);
            }, 1000);
        }
        else if (!isRunning)
            clearInterval(interval);

        return () => { clearInterval(interval); console.log('clearing interval') }

    }, [remainingSeconds]);

    const start = () => {
        setRemainingSeconds(parseInt(selectedMinutes) * 60 + parseInt(selectedSeconds));
        setIsRunning(true);
    }

    const stop = () => {
        setIsRunning(false);
        clearInterval(interval); console.log('clearing interval')
    }

    const createArray = length => {
        const arr = [];
        let i = 0;
        while (i < length) {
            arr.push(i.toString())
            i += 1;
        }
        return arr;
    }

    const AVAIALBLE_MINUTES = createArray(10);
    const AVAIALBLE_SECONDS = createArray(60);


    const renderPickers = () => {
        return (
            <View style={styles.pickerContainer}>
                <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={selectedMinutes} onValueChange={itemValue => { setSelectedMinutes(itemValue) }}
                    mode="dropdown">
                    {AVAIALBLE_MINUTES.map(value => (
                        <Picker.Item key={value} label={value} value={value} />
                    ))}
                </Picker>
                <Text style={styles.pickerItem}>MIN</Text>
                <Picker
                    style={[styles.picker, { marginLeft: 40 }]}
                    itemStyle={styles.pickerItem}
                    selectedValue={selectedSeconds} onValueChange={itemValue => { setSelectedSeconds(itemValue) }}
                    mode="dropdown">
                    {AVAIALBLE_SECONDS.map(value => (
                        <Picker.Item key={value} label={value} value={value} />
                    ))}
                </Picker>
                <Text style={styles.pickerItem}>SEC</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {isRunning ? (<Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>)
                : (renderPickers())
            }

            {
                isRunning ? (
                    <TouchableOpacity onPress={stop} style={[styles.button, styles.buttonStop]}>
                        <Text style={[styles.buttonText, styles.buttonStopText]}>Stop</Text>
                    </TouchableOpacity>
                ) : (
                        <TouchableOpacity onPress={start} style={styles.button}>
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                    )}

        </View>
    );
}

