import React, { useState, useEffect } from "react";
import {Configuration, OpenAIApi } from "openai";

const KEY = import.meta.env.REACT_APP_OPENAI_API_KEY;

const ContractPrompt = () => {
  const configuration = new Configuration({
    apiKey: KEY,
  });

  const openai = new OpenAIApi(configuration);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: input,
        temperature: 0.5,
        max_tokens: 100,
      });

      setResponse(result.data.choices[0].text);
      setInput(""); // 입력 필드를 지웁니다.

    } catch (e) {
      setResponse("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResponse("");
    setInput("");
  };

  return (
    <div className="container">
      <h1>Contract Assistent</h1>
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          className="inputArea"
          type="text"
          value={input}
          placeholder="Please ask to OpenAI"
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <div className="button-container">
          <button disabled={loading} type="submit">
            {loading ? "Generating..." : "Generate"}
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
      <div className="response">
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default ContractPrompt;
