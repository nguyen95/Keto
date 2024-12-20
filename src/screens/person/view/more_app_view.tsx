import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Text} from 'react-native';
import {
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {get} from '../../../services/api';
import {get_apps_list} from '../../../services/api/api_key';
import UIStore from '../../../shared/store/ui';
import BaseHeader from '../../../shared/ui/containers/base_header';
import AppStyle from '../../../shared/ui/styles/app.style';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import {IC_BACK} from '../../../utils/icons';

type MoreAppObj = {
  title: string;
  desc: string;
  icon: string;
  ios_url: string;
  android_url: string;
};

type MoreAppScreenProps = {
  navigation: any;
  uiStore: UIStore;
};

const MoreAppScreen: React.FC<MoreAppScreenProps> = ({
  navigation,
  uiStore,
}: MoreAppScreenProps) => {
  const [moreAppData, changeMoreAppData] = useState<Array<MoreAppObj>>();
  useEffect(() => {
    async function getMoreAppData() {
      uiStore.showLoading('more_app');
      const [err, res] = await get(get_apps_list(), null);
      uiStore.hideLoading('more_app');
      if (!err) {
        const appsData = res.data;
        changeMoreAppData(appsData);
      }
    }
    getMoreAppData();
    return;
  }, []);

  const renderItem = ({item}) => {
    const app = item as MoreAppObj;
    return (
      <TouchableOpacity
        onPress={() => {
          const url = Platform.OS === 'ios' ? app.ios_url : app.android_url;
          Linking.openURL(url);
        }}
        style={styles.itemContainer}>
        <Image style={styles.itemImage} source={{uri: app.icon}} />
        <View style={{margin: 8}}>
          <Text style={styles.itemTitle}>{app.title}</Text>
          <Text style={styles.itemDes}>{app.desc}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={<Image source={IC_BACK} style={styles.icon} />}
        rightElement={<View style={styles.icon} />}
        centerElement={<Text style={commonStyles.headerTitle}>More Apps</Text>}
        leftAction={goBack}
      />
      <View style={{paddingTop: 16}}>
        <FlatList
          data={moreAppData}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
        />
      </View>
    </View>
  );
};

export default MoreAppScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 8,
  },
  itemImage: {
    width: Dimensions.get('window').width / 6,
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 5,
    margin: 8,
  },
  itemTitle: {
    fontSize: AppStyle.Text.Medium,
    fontWeight: 'bold',
  },
  itemDes: {
    fontSize: AppStyle.Text.Normal,
    color: AppStyle.Color.DarkBlue,
  },
});
