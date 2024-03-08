import React from "react";

import "./PageLoader.scss";

const PageLoader: React.FC = () => {
  return (
    <div className="page-loader">
      <div className="page-loader__content">
        <cite className="page-loader__title">
          <h1>MyChat</h1>
        </cite>
        <footer className="author">by Dreizer</footer>
      </div>
    </div>
  );
};

export default PageLoader;
