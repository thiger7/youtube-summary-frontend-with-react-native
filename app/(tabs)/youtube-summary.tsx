// app/youtube-summary.tsx
import { VIDEOS_ENDPOINT } from "@/src/constants/urls";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";

const YoutubeSummaryApp = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitUrl = async () => {
    try {
      setLoading(true);
      setSummary(null);

      await fetch(VIDEOS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ youtube_url: youtubeUrl }),
      });

      setYoutubeUrl("");
      startPolling();
    } catch (error) {
      console.error("Error submitting URL:", error);
      setLoading(false);
    }
  };

  const clearUrl = () => {
    setYoutubeUrl("");
  }

  const startPolling = () => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          `${VIDEOS_ENDPOINT}?youtube_url=${encodeURIComponent(youtubeUrl)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );
        const data = await response.json();

        if (response.ok && data.summary) {
          // 要約が取得できた場合
          setSummary(data.summary);
          clearInterval(intervalId); // ポーリングを終了
          setLoading(false);
        } else if (response.status === 202) {
          // 処理がまだ完了していない場合、待機メッセージを表示
          console.log("Processing, please wait...");
        } else {
          // その他のエラー処理
          console.error(
            "Error fetching summary:",
            data.message || "Unknown error",
          );
          clearInterval(intervalId);
          setLoading(false);
        }
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(intervalId);
        setLoading(false);
      }
    }, 5000); // ポーリング間隔を5秒
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              padding: 20,
              marginTop: 50,
            }}
          >
            YouTube Summary App
          </Text>
        </View>
        <TextInput
          placeholder="YouTube URL を入力してください"
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10, margin: 20 }}
          onSubmitEditing={submitUrl}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={clearUrl}>
          <Text
            style={{
              padding: 10,
              backgroundColor: "#ccc",
              color: "black",
              borderRadius: 6,
              margin: 20,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            クリア
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={submitUrl}>
          <Text
            style={{
              padding: 10,
              backgroundColor: "green",
              color: "white",
              borderRadius: 6,
              margin: 20,
              textAlign: "center",
            }}
          >
            Youtube動画の要約を始める
          </Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <View>
          <Text style={{ fontSize: 24, padding: 20, marginTop: 10 }}>
            Summary
          </Text>
        </View>
        {summary && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary:</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#4CAF50", // 好みの枠線カラー
    borderRadius: 10, // 角丸
    backgroundColor: "#F9F9F9", // 背景色を薄い色に
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Android用の影
  },
  summaryTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
  },
});

export default YoutubeSummaryApp;
