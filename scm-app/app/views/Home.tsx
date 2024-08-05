import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { FC, useEffect, useState } from 'react'
import ChatNotification from '@ui/ChatNotification';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from 'app/navigator/AppNavigator';
import SearchBar from '@components/SearchBar';
import size from '@utils/size';
import CategoryList from '@components/CategoryList';
import LatestProductList, { LatestProduct } from '@components/LatestProductList';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';

interface Props {}

const Home: FC<Props> = (props) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const { authClient } = useClient();

  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{products: LatestProduct[]}>(authClient.get('/product/latest'));
    if (res?.products) {
      setProducts(res.products);
    }
  };

  useEffect(() => {
    fetchLatestProduct();
  }, []);

  return (
    <>
    <ChatNotification onPress={() => navigate('Chats')} />
    <ScrollView style={styles.container}>
      <SearchBar />
      <CategoryList onPress={() => navigate('ProductList')} />
      <LatestProductList data={products} onPress={({id}) => navigate('SingleProduct', {id})} />
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: size.padding,
      flex: 1,
    },
});

export default Home