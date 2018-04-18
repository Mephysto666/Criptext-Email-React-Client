import React from 'react';
import randomcolor from 'randomcolor';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { getTwoCapitalLetters } from './../utils/StringUtils';
import './suggestion.css';

const Suggestion = (suggestion, { query }) => {
  const { name, email } = suggestion;
  const suggestionText = name ? name : email;
  const letters = getTwoCapitalLetters(suggestionText);
  const color = randomcolor({
    seed: letters,
    luminosity: 'bright'
  });
  const parts = name
    ? getMatchesOnNameAndEmail(name, email, query)
    : getMatchesOnEmail(email, query);

  return (
    <div className="recipient-suggestion">
      {renderCapitalLetters(color, letters)}
      {renderHighlightedText(parts, name)}
      {name ? renderHighlightedRightEmail(parts.email) : null}
    </div>
  );
};

const getMatchesOnNameAndEmail = (name, email, query) => {
  const response = {};
  const nameMatches = match(name, query);
  if (!nameMatches.length) {
    response.name = [{ highlight: false, text: name }];
    const emailMatches = match(email, query);
    response.email = parse(email, emailMatches);
  } else {
    response.name = parse(name, nameMatches);
    response.email = [{ highlight: false, text: email }];
  }
  return response;
};

const getMatchesOnEmail = (email, query) => {
  const emailMatches = match(email, query);
  const emailParts = parse(email, emailMatches);
  return {
    name: [{ highlight: false, text: '' }],
    email: emailParts
  };
};

const renderCapitalLetters = (color, letters) => (
  <span style={{ background: color }} className="badge">
    <span className="badge-text">{letters}</span>
  </span>
);

const renderHighlightedText = (parts, isName) => (
  <span className="highlighted-text">
    {isName ? null : '<'}
    {isName
      ? renderHighlightedLeftName(parts.name)
      : renderHighlightedLeftEmail(parts.email)}
    {isName ? null : '>'}
  </span>
);

const renderHighlightedLeftName = name => {
  return name.map((part, index) => {
    const className = part.highlight ? 'highlight' : null;
    return (
      <span className={className} key={index}>
        {part.text}
      </span>
    );
  });
};

const renderHighlightedLeftEmail = email => {
  return email.map((part, index) => {
    const className = part.highlight ? 'highlight' : null;
    return (
      <span className={className} key={index}>
        {part.text}
      </span>
    );
  });
};

const renderHighlightedRightEmail = email => (
  <span className="sugestion-email-right">
    {email.map((part, index) => {
      const className = part.highlight ? 'highlight' : null;
      return (
        <span className={className} key={index}>
          {part.text}
        </span>
      );
    })}
  </span>
);

export default Suggestion;
