import {createGlobalStyle} from 'styled-components';

import {styledTheme} from './style';

export const GlobalStyle = createGlobalStyle<{theme: typeof styledTheme}>`
  html, body {
    margin: 0;
    height:100%;
    scroll-behavior: smooth;
  }

  body {
    overflow-x: hidden;
  }

  #root {
    height: 100%;
  }

  /* markdown */
  pre {
    background: ${props => props.theme.codeBgColor};
    padding: 15px;
    border-radius: 10px;
  }

  .md-codespan {
    background: ${props => props.theme.codeBgColor};
    color: ${props => props.theme.secondaryColor};
    padding: 3px 10px;
    border-radius: 5px;
  }

  .md-img-container {
    width: 100%;
    display: flex;
    justify-content:center;
    align-items: center;

    & .md-img {
      border-radius: 5px;
      max-height: 500px;
    }
  }

  .md-heading {
    font-weight: 300;

    &:target {
      padding-top: 70px;
      margin-top: -70px;
    }
  }

  .md-text {
    color: ${props => props.theme.articleColor};
    font-size: 16px;
    font-weight: 400;
    line-height: 1.7;
  }

  .md-quote-wrapper {
    display: flex;
    margin: 15px 0 15px 35px;

    .md-quote-block {
      width: 5px;
      background: ${props => props.theme.secondaryColor};
    }

    .md-quote-content {
      width: 100%;
      border-radius: 0 3px 3px 0;
      padding: 0 15px;
      background: ${props => props.theme.quoteBgColor};
    }
  }
`;
