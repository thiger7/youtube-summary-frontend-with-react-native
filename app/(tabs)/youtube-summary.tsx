// app/youtube-summary.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";

const YoutubeSummaryApp = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitUrl = async () => {
    try {
      setLoading(true);
      setSummary(null);

      await fetch(
        "https://3598-2405-6582-1fe0-1f00-fc17-93a0-e36-f375.ngrok-free.app/videos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ youtube_url: youtubeUrl }),
        },
      );

      // ポーリングを開始
      startPolling();
    } catch (error) {
      console.error("Error submitting URL:", error);
      setLoading(false);
    }
  };

  const startPolling = () => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          `https://3598-2405-6582-1fe0-1f00-fc17-93a0-e36-f375.ngrok-free.app/videos?youtube_url=${encodeURIComponent(
            youtubeUrl,
          )}`,
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
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold", padding: 20, marginTop: 200 }}>
          YouTube Summary App
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TextInput
          placeholder="Enter YouTube URL"
          value={youtubeUrl}
          onChangeText={setYoutubeUrl}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
        <Button title="Submit" onPress={submitUrl} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {summary && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "bold" }}>Summary:</Text>
            <Text>{summary}</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default YoutubeSummaryApp;
