let dataLength;
let articleId;
document.addEventListener("DOMContentLoaded", () => {
  fetch("../json/articles.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((articlesData) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      articleId = urlParams.get("articleId") ? +urlParams.get("articleId") : 0;
      dataLength = articlesData.length;
      for (let i = 0; i < articlesData.length; i++) {
        if (articlesData[i].id === articleId) {
          const articleTitle = document.getElementById("article-title");
          const articleDiscription = document.getElementById(
            "article-discription"
          );
          const articleContent = document.getElementById("article-content");
          articleContent.innerHTML = articlesData[i].content;
          articleTitle.innerHTML = articlesData[i].title;
          articleDiscription.innerHTML = articlesData[i].description;
          const codeSections = Array.from(
            document.getElementsByClassName("code-section")
          );
          for (let i = 0; i < codeSections.length; i++) {
            let codeLang = codeSections[i].getAttribute("$lang");
            let code = codeSections[i].getAttribute("$code");
            let fileName = codeSections[i].getAttribute("$file");
            let noneProps = codeSections[i].getAttribute("$none") || "";
            codeSections[i].innerHTML = `
            <div class="lang">
            ${codeLang}
            <div style="font-size: 15px;text-transform: none;" class="file-name">${fileName}</div>
            <div class="bullte"></div>
            </div>
            <code>
              <div class="buttons">
              <button class="-copy copy">انسخ</button>
              <button class="-open"><a class="open" target="_blank" href="test.html" style="color: white;">شاهد في المتصفح</a></button>
              <button class="-download"><a style="color: white;" class="download">تنزيل</a></button>
              <button class="-try"><a target="_blank" href="code-editor.html" style="color: white;">جرب في محرر الاكواد</a></button>
              </div>
              <pre class="code"></pre>
            </code>
            `;
            let codePre = document.getElementsByClassName("code")[i];
            codePre.textContent = code;

            noneProps.split(",").forEach((prop) => {
              switch (prop) {
                case "copy":
                  document.getElementsByClassName("-" + "copy")[i].style.display =
                    "none";
                  break;
                case "open":
                  document.getElementsByClassName("-" + "open")[
                    i
                  ].style.display = "none";
                  break;
                case "download":
                  document.getElementsByClassName("-" + "download")[
                    i
                  ].style.display = "none";
                  break;
                case "try":
                  document.getElementsByClassName("-" + "try")[
                    i
                  ].style.display = "none";
                  break;
              }
            });
            document
              .getElementsByClassName("copy")
              [i].addEventListener("click", () => {
                navigator.clipboard.writeText(
                  document.getElementsByClassName("code")[i].textContent
                );
                window.alert("تم النسخ بنجاح!");
              });
            document
              .getElementsByClassName("open")
              [i].addEventListener("click", () => {
                const data = { code: code };
                const queryString = new URLSearchParams(data).toString();
                document.getElementsByClassName("open")[
                  i
                ].href = `test.html?${queryString}`;
              });
            document
              .getElementsByClassName("download")
              [i].addEventListener("click", () => {
                const blob = new Blob([code], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.getElementsByClassName("download")[i];
                a.href = url;
                a.download = fileName;
              });
          }
          break;
        } else {
          const articleContent = document.getElementById("article-content");
          articleContent.innerHTML = `
            <p style="font-size: 25px;">هذه الصفحه غير متاحة. <br /> جرب:</p>
            <button style="
            display: inline-block;
            background: var(--second-color);
            border: none;
            margin: 10px;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
            "><a style="color: black;" href="index.html">عد للصفحة الرئيسية</a> </button>
            <button style="
            display: inline-block;
            background: var(--second-color);
            border: none;
            margin: 10px;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
            " onclick="location.reload()">اعاده التحميل</button>
            <button style="
            display: inline-block;
            background: var(--second-color);
            border: none;
            margin: 10px;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
            " onclick="window.history.go(-1)">عد للخلف</button>
          `;
        }
      }
    })
    .catch((error) =>
      console.error("There was a problem with the fetch operation:", error)
    );
});

let preBtn = document.getElementById("pre");
let nextBtn = document.getElementById("next");
let nSpan = document.getElementById("num");

window.addEventListener("load", () => {
  if (articleId >= dataLength) {
    nextBtn.classList.add("not-active");
  }
  if (articleId <= 1) {
    preBtn.classList.add("not-active");
  }
  nSpan.textContent = articleId;

  preBtn.onclick = () => {
    const data = { articleId: articleId - 1 };
    const queryString = new URLSearchParams(data).toString();
    window.location.href = `article-content.html?${queryString}`;
  };
  nextBtn.onclick = () => {
    const data = { articleId: articleId + 1 };
    const queryString = new URLSearchParams(data).toString();
    window.location.href = `article-content.html?${queryString}`;
  };
});
