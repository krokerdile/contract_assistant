import "./App.css";
import styled from "styled-components";
import { useRef, useState } from "react";
import "./fonts/Font.css";
import { Configuration, OpenAIApi } from "openai";

// import Slider from "react-slick";

const KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const input = useRef(null);
  const [value, setValue] = useState(0);

  const handleClick = () => {
    if (input.current) {
      input.current.value = "";
      setValue("");
    }
  };

  const configuration = new Configuration({
    apiKey: KEY,
  });

  const openai = new OpenAIApi(configuration);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: value,
        temperature: 0.5,
        max_tokens: 100,
      });

      setResponse(result.data.choices[0].text);
      setValue(""); // 입력 필드를 지웁니다.
    } catch (e) {
      setResponse("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResponse("");
    setValue("");
  };

  return (
    <>
      <MainBox>
        <Title>Contract Assistant</Title>
        {/* <p>
          현재 검색어는 <strong>{value}</strong>입니다
        </p> */}
        <div className="response">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
        <InputWrapper>
          <InputBox
            type="text"
            ref={input}
            onChange={() => {
              setValue(input.current.value);
            }}
          />

          <SearchButton type="button" onClick={handleClick}>
            Reset
          </SearchButton>
          <SearchButton type="button" onClick={handleSubmit}>
            Search
          </SearchButton>
        </InputWrapper>

        <button disabled={loading} type="submit">
          {loading ? "Generating..." : "Generate"}
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <ButtonList>
          <TopicButton>근로계약서</TopicButton>
          <TopicButton>전세계약서</TopicButton>
          <TopicButton>프리랜서계약서</TopicButton>
        </ButtonList>
      </MainBox>
    </>
  );
}

export default App;

const Title = styled.p`
  font-size: 5rem;
  font-family: "intelone-mono-font-family-regular";
  margin: 0;
  padding: 0;
`;

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
`;

// const SliderBox = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

const InputBox = styled.input`
  height: 2rem;
  font-family: "intelone-mono-font-family-regular";
  width: 100%;
  font-size: 1.3rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 0.1rem black solid;
`;

const SearchButton = styled.button`
  height: 2rem;
  padding-bottom: 1.6rem;
`;

const TopicButton = styled.button`
  width: 30%;
`;

const ButtonList = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 1rem;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  flex-direction: row;
  margin-top: 1rem;
`;
