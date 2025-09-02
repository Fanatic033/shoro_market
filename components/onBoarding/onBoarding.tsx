import { useOnBoardingStore } from "@/store/onBoardingStore"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, type FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

interface Slide {
  id: string
  title: string
  subtitle: string
  backgroundColor: [string, string]
  textColor: string
}

const OnBoardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const flatListRef = useRef<FlatList>(null)
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { setHasSeenOnBoarding } = useOnBoardingStore()

  const slides: Slide[] = [
    {
      id: "1",
      title: "Добро пожаловать в ШОРО!",
      subtitle: "Натуральные напитки высочайшего качества с доставкой прямо к вашему дому",
      backgroundColor: ["#e53935", "#c62828"],
      textColor: "#FFFFFF",
    },
    {
      id: "2",
      title: "Быстрая доставка",
      subtitle: "Получите свои любимые напитки ШОРО всего за 30 минут в любую точку города",
      backgroundColor: ["#000000", "#424242"],
      textColor: "#FFFFFF",
    },
    {
      id: "3",
      title: "Большой ассортимент",
      subtitle: "Чалап, Айран, Боза, Тан и многие другие традиционные напитки всегда в наличии",
      backgroundColor: ["#DC143C", "#B71C1C"],
      textColor: "#FFFFFF",
    },
  ]

  const floatAnimation = useRef(new Animated.Value(0)).current
  const titleAnimation = useRef(new Animated.Value(0)).current
  const subtitleAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    )
    floating.start()
  }, [floatAnimation])

  useEffect(() => {
    titleAnimation.setValue(0)
    subtitleAnimation.setValue(0)

    Animated.sequence([
      Animated.timing(titleAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [currentIndex])

  const FloatingCircle = ({ style }: { style: any }) => {
    const translateY = floatAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -20],
    })

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{ translateY }],
          },
        ]}
      />
    )
  }

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
    const titleTranslateY = titleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    })

    const titleOpacity = titleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    })

    const subtitleTranslateY = subtitleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0],
    })

    const subtitleOpacity = subtitleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    })

    return (
      <LinearGradient
        colors={item.backgroundColor}
        style={[styles.slide, { paddingTop: insets.top }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.slideContent}>
          <View style={styles.decorativeContainer}>
            <FloatingCircle style={[styles.circle, styles.circle1]} />
            <FloatingCircle style={[styles.circle, styles.circle2]} />
            <FloatingCircle style={[styles.circle, styles.circle3]} />
          </View>

          <View style={styles.iconContainer}>
            <View style={styles.iconBackground} />
          </View>

          <View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.title,
                {
                  color: item.textColor,
                  opacity: titleOpacity,
                  transform: [{ translateY: titleTranslateY }],
                },
              ]}
            >
              {item.title}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  color: `${item.textColor}CC`,
                  opacity: subtitleOpacity,
                  transform: [{ translateY: subtitleTranslateY }],
                },
              ]}
            >
              {item.subtitle}
            </Animated.Text>
          </View>
        </View>
      </LinearGradient>
    )
  }

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
    } else {
      setHasSeenOnBoarding(true)
      router.replace("/(auth)/login")
    }
  }

  const onMomentumScrollEnd = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize)
    setCurrentIndex(index)
  }

  const Pagination = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: "clamp",
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          })

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: currentIndex === index ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                },
              ]}
            />
          )
        })}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={slides[currentIndex].backgroundColor[0]}
        translucent={false}
      />

      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={[styles.skipButton, { top: insets.top + 20 }]} onPress={goToNext} activeOpacity={0.8}>
          <Text style={styles.skipText}>
            <Ionicons name="chevron-forward-sharp" size={40} color={"white"} />
          </Text>
        </TouchableOpacity>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
      />

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 30 }]}>
        <Pagination />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: currentIndex === slides.length - 1 ? "#FFFFFF" : "rgba(255,255,255,0.2)" },
            ]}
            onPress={goToNext}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.nextText,
                { color: currentIndex === slides.length - 1 ? slides[currentIndex].backgroundColor[0] : "#FFFFFF" },
              ]}
            >
              {currentIndex === slides.length - 1 ? "Начать" : "Далее"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e53935",
  },
  slide: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 160,
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  circle1: {
    width: 200,
    height: 200,
    top: 60,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    top: 200,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: 300,
    right: 50,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 80,
    position: "relative",
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "500",
  },
  skipButton: {
    position: "absolute",
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  skipText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    height: 10,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    alignItems: "center",
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    minWidth: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  nextText: {
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default OnBoardingScreen
