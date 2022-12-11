import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitButtonRef = useRef(null);
  const urlInputRef = useRef(null);

  useEffect(() => {
    urlInputRef.current && urlInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!url) {
      setResponseData(null);
      setError("");
    }
  }, [url]);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      console.log("enter press here! ");
      submitButtonRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm(e);
  };

  const submitForm = async () => {
    try {
      setResponseData(null);
      setLoading(true);
      setError("");
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const body = {
        url,
      };
      const res = await fetch("/api/rank", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const { data, success, message } = await res.json();
      setLoading(false);
      if (!success) {
        setResponseData(null);
        return setError(message);
      }
      setError("");
      setResponseData(data);
    } catch (error) {
      setResponseData(null);
      setLoading(false);
      setError("");
    }
  };

  return (
    <div id="main">
      <h1 id="heading">Alexa Rank Checker</h1>
      <h3>Enter url here:</h3>
      <input
        ref={urlInputRef}
        type="text"
        id="url-input"
        onKeyDown={handleKeyDown}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://mukundjajadiya.web.app"
      />
      <button
        ref={submitButtonRef}
        id="submit-button"
        className={`${url ? "" : "disabled-button"}`}
        onClick={handleSubmit}
        disabled={url ? false : true}
      >
        {loading ? "Loading..." : "Search"}
      </button>
      <div id="table-div"></div>

      {error && <p id="error-box">{error}</p>}

      {responseData && (
        <table>
          <tr>
            <th>sr</th>
            <th>Given URL</th>
            <th>Global Rank</th>
            <th>Reach</th>
            <th>Country</th>
            <th>Country Rank</th>
            <th>Change</th>
          </tr>

          {responseData.map((result, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{result.result.givenURL}</td>
                <td>{result.result.globalRank}</td>
                <td>{result.result.reach}</td>
                <td>{result.result.country}</td>
                <td>{result.result.countryRank}</td>
                <td>{result.result.change}</td>
              </tr>
            );
          })}
        </table>
      )}
    </div>
  );
}
