// server/index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/summary", async (req, res) => {
  const { placeName, country } = req.body;
  try {
    // isUS 계산…
    const isUS =
      country === "United States" || country === "USA" || country === "US";
    const language = isUS ? "en" : "ko";
    const region = isUS ? "us" : "kr";

    // 1) Text Search
    const textSearch = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
        `query=${encodeURIComponent(placeName)}` +
        `&language=${language}&region=${region}` +
        `&key=${process.env.GOOGLE_KEY}`
    ).then((r) => r.json());
    console.log("👉 textSearch:", textSearch.results?.[0]);

    if (!textSearch.results?.[0]) {
      // 반드시 함수 내부에서만 return
      res.json({ summary: "리뷰가 없습니다." });
      return;
    }
    const placeId = textSearch.results[0].place_id;

    // 2) Details
    const details = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}` +
        `&fields=rating,reviews,user_ratings_total` +
        `&language=${language}&region=${region}` +
        `&key=${process.env.GOOGLE_KEY}`
    ).then((r) => r.json());
    console.log("👉 detailsData:", details);

    const reviewsArr = (details.result.reviews || []).slice(0, 5);
    if (reviewsArr.length === 0) {
      res.json({ summary: "리뷰가 없습니다." });
      return;
    }

    // 3) OpenAI 요약
    const reviewsText = reviewsArr
      .map((r) => `- (${r.rating}) ${r.text}`)
      .join("\n");
    const prompt = `다음 공연장 리뷰를 참고해…\n${reviewsText}`;
    const chat = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    }).then((r) => r.json());

    const summary = chat.choices?.[0]?.message?.content?.trim() || "요약 실패";
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ summary: "리뷰 요약 생성 중 오류가 발생했습니다." });
  }
}); // ← 여기에 콜백 함수 블록이 끝나야 함

app.listen(process.env.PORT, () =>
  console.log(`▶ API server running on http://localhost:${process.env.PORT}`)
);
