import Head from "next/head";
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
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <div id="main">
        <h1 id="heading">Alexa Rank Checker</h1>
        <h3>Enter url here:</h3>
        <textarea
          ref={urlInputRef}
          id="url-input"
          rows={5}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`Enter multiple url or domain name on new line like:\n\nhttps://mukundjajadiya.web.app\nhttps:example.com`}
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

        {error && <p id="error-box">{error}</p>}

        <div className="table-wrapper">
          {responseData && (
            <table className="table">
              <thead>
                <tr>
                  <th>sr</th>
                  <th>Given URL</th>
                  <th>Global Rank</th>
                  <th>Reach</th>
                  <th>Country</th>
                  <th>Country Rank</th>
                  <th>Change</th>
                </tr>
              </thead>

              <tbody>
                {responseData.map((result, index) => {
                  return (
                    <tr key={index}>
                      <td data-label="sr">{index + 1}</td>
                      <td data-label="Given URL">
                        {result.givenURL.substring(0, 30)}...
                      </td>
                      <td data-label="Global Rank">{result.globalRank}</td>
                      <td data-label="Reach">{result.reach}</td>
                      <td data-label="Country">{result.country}</td>
                      <td data-label="Country Rank">{result.countryRank}</td>
                      <td data-label="Change">{result.change}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
