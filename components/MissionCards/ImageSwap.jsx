import {
    ActivityIndicator,
    Animated,
    Button,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {useEffect, useRef, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loading from "../Loading";

export default function ImageSwap({images, imageHeight, imageMarginTop, imageIndexMarginTop, navigation}) {
    const scroll = useRef(null);
    const [imageNumber, setImageNumber] = useState(1);
    const [previousScroll, setPreviousScroll] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentOffset, setCurrentOffset] = useState(0);
    const SCREEN_WIDTH = Dimensions.get('window').width

    const handleScroll = (offset) => {
        scroll.current.scrollTo({x: offset, y:0, animated: true})
        setPreviousScroll(offset)
    }

    return (
        <View>
            <View
                style={{
                    position: "absolute",
                    width: 35,
                    height: 35,
                    backgroundColor: "#cccccc",
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    right: 10,
                    top: imageIndexMarginTop,
                    zIndex: 99,
                    opacity: 0.7,
                }}
            >
                <Text>{imageNumber}/{images.length}</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{width: "100%", }}
                scrollEventThrottle={16}
                ref={scroll}
                onScroll={(event) => setCurrentOffset(event.nativeEvent.contentOffset.x)}
                onScrollEndDrag={() => {
                    if ((currentOffset > previousScroll) && previousScroll < SCREEN_WIDTH*(images.length-1)) {
                        handleScroll(previousScroll+SCREEN_WIDTH)
                        setImageNumber(imageNumber+1)
                    }
                    if ((currentOffset < previousScroll) && previousScroll > 0) {
                        handleScroll(previousScroll-SCREEN_WIDTH)
                        setImageNumber(imageNumber-1)
                    }
                }}
            >
                {images.map((image, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        onPress={() => navigation.navigate("ImageViewer", {routeImage: image})}
                    >
                        {loading && (
                            <View
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <ActivityIndicator size="small" color="#959595" />
                            </View>
                        )}
                        <Image
                            source={{uri: image}}
                            style={{
                                width: SCREEN_WIDTH,
                                height: imageHeight,
                                resizeMode: "cover"
                            }}
                            onLoadEnd={() => setLoading(false)}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}