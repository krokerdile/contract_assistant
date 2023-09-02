import "./App.css";
import styled from "styled-components";
import { useRef, useState } from "react";
import "./fonts/Font.css";
import Slider from "react-slick";

function App() {
  const input = useRef(null);
  const [value, setValue] = useState(0);

  const handleClick = () => {
    if (input.current) {
      input.current.value = "";
      setValue("");
    }
  };
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <MainBox>
        <Title>Contract Assistant</Title>
        <p>현재 검색어는 {value}입니다</p>
        <InputBox
          type="text"
          ref={input}
          onChange={() => {
            setValue(input.current.value);
          }}
        />
        <button type="button" onClick={handleClick}>
          Click to Reset
        </button>
        <SliderBox>
          <Slider {...settings}>
            <div>
              <h3>1</h3>
            </div>
            <div>
              <h3>2</h3>
            </div>
            <div>
              <h3>3</h3>
            </div>
            <div>
              <h3>4</h3>
            </div>
            <div>
              <h3>5</h3>
            </div>
            <div>
              <h3>6</h3>
            </div>
            <div>
              <h3>7</h3>
            </div>
            <div>
              <h3>8</h3>
            </div>
          </Slider>
        </SliderBox>
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

const SliderBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputBox = styled.input`
  height: 2rem;
  font-family: "intelone-mono-font-family-regular";
  width: 100%;
  font-size: 1.3rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 0.1rem black solid;
`;
