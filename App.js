import React from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import { ApolloProvider } from "react-apollo";
import makeApolloClient from "./src/makeApolloClient.js";

import { LinearGradient } from "expo-linear-gradient";

import gql from "graphql-tag";

import { useQuery } from "@apollo/react-hooks";

export const FETCH_FEED = gql`
  query {
    podcastForFeedWithIdentifier(identifier: "p2p") {
      title
      cover {
        url
      }
    }
  }
`;

const AppView = () => {
  const { data, error, loading } = useQuery(FETCH_FEED);

  const feed = data && data.podcastForFeedWithIdentifier;

  return (
    <View style={styles.container}>
      {feed ? (
        <>
          <Image
            style={styles.cover}
            source={{
              uri: feed.cover.url.replace(".test", ".fr"),
            }}
            width={200}
            height={200}
          />
          <Text style={[styles.text, styles.title]}>{feed.title}</Text>
          <Image
            style={styles.background}
            source={{
              uri: feed.cover.url.replace(".test", ".fr"),
            }}
          />
        </>
      ) : error ? (
        <Text style={styles.text}>{JSON.stringify(error)}</Text>
      ) : loading ? (
        <Text style={styles.text}>Loading</Text>
      ) : (
        <Text style={styles.text}>???</Text>
      )}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100vh",
          zIndex: -1,
        }}
      />
    </View>
  );
};

export default function App() {
  const [client, setClient] = React.useState(null);

  const fetchSession = async () => {
    // fetch session
    const client = makeApolloClient();
    setClient(client);
  };

  React.useEffect(() => {
    fetchSession();
  }, []);

  return client ? (
    <ApolloProvider client={client}>
      <AppView />
    </ApolloProvider>
  ) : (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "black",
  },
  text: {
    color: "#fefefe",
  },
  title: { fontSize: 23, fontWeight: 500, margin: 10 },
  cover: {
    width: 200,
    height: 200,
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.50)",
  },
  background: {
    backgroundSize: "125%",
    backgroundPosition: "center",
    transform: [{ scale: 1.5 }],
    filter: "blur(50px)",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
    zIndex: -2,
  },
});
