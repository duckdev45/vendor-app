import {Image} from 'expo-image';
import {Platform, StyleSheet} from 'react-native';

import {HelloWave} from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Link} from 'expo-router';

export default function HomeScreen() {
    return (
        <ThemedView style={{flex: 1}}>
            <ThemedView style={{height: '80%'}}>
                <ParallaxScrollView
                    headerBackgroundColor={{light: '#A1CEDC', dark: '#1D3D47'}}
                    headerImage={
                        <Image
                            source={require('@/assets/images/icon.png')}
                            style={styles.reactLogo}
                        />
                    }>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText type="title">安安你好! :)</ThemedText>
                        <HelloWave/>
                    </ThemedView>
                    <ThemedView style={styles.stepContainer}>
                        <ThemedText>開始使用 Vendor App</ThemedText>
                        <ThemedText>
                            1. 點擊相機
                        </ThemedText>
                        <ThemedText>
                            2. 掃描 QR Code
                        </ThemedText>
                    </ThemedView>
                </ParallaxScrollView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: '100%',
        width: '100%',
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
