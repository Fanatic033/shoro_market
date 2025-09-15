// // components/GoogleSignInButton.tsx
// import { useAuthStore } from '@/store/authStore';
// import { useGoogleAuth } from '@/utils/googleWeb';
// import axiosApi from '@/utils/instance';
// import { router } from 'expo-router';
// import { useEffect } from 'react';
// import { Button } from 'react-native';
// import { Toast } from 'toastify-react-native';

// export default function GoogleSignInButton() {
//   const { request, response, signInWithGoogle} = useGoogleAuth(); // ← обновлённый хук
//   const { setUser } = useAuthStore();

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { code } = response.params;
      
//       // ✅ ВРЕМЕННО: просто выводим code в консоль и показываем тост
//       console.log('✅ Получен authorization code:', code);
//       Toast.success('Успех! Code получен ✅', 'bottom');
//       alert('Code: ' + code); // ← Опционально, для наглядности
  
//       // ❌ ЗАКОММЕНТИРУЙ вызов handleGoogleCode на время теста
//       // handleGoogleCode(code);
//     }
//     if (response?.type === 'error') {
//       Toast.error('Ошибка авторизации Google', 'bottom');
//       console.error('Auth error:', response.error);
//     }
//   }, [response]);

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { code } = response.params; // ← получаем authorization code
//       handleGoogleCode(code);
//     }
//     if (response?.type === 'error') {
//       Toast.error('Ошибка авторизации Google', 'bottom');
//     }
//   }, [response]);

//   const handleGoogleCode = async (code: string) => {
//     try {
//       // ✅ Отправляем CODE на бэкенд
//       const { data } = await axiosApi.post('/auth/oauth2/google/code', {
//         code,
//         redirectUri: 'https://auth.expo.io/@fanatic033/shoromarket', // ← явно передаём, если бэкенд требует
//       });

//       const { accessToken, refreshToken, needsPhone, user } = data;

//       if (user) {
//         setUser({
//           id: user.id,
//           name: user.name || 'Пользователь',
//           phoneNumber: user.phoneNumber || '',
//           accessToken,
//           refreshToken,
//         });
//       }

//       Toast.success('Вы вошли через Google!', 'bottom');

//       if (needsPhone) {
//         // router.navigate('/(auth)/phone-verify');
//       } else {
//         router.replace('/(tabs)/home');
//       }
//     } catch (error: any) {
//       Toast.error(error.message || 'Ошибка входа через Google', 'bottom');
//     }
//   };

//   const handlePress = async () => {
//     await signInWithGoogle(); // ← используем обновлённую функцию
//   };

//   return (
//     <Button
//       title={response?.type === 'dismiss' ? 'Вход...' : 'Войти через Google'}
//       disabled={!request || response?.type === 'dismiss'}
//       onPress={handlePress}
//     />
//   );
// }