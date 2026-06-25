"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function NoticePdfButton({

  noticeId,
  fileName,
  downloadFunction

}) {

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {

    try {

      setLoading(true);

      const blob =
        await downloadFunction(noticeId);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        fileName || "Notice.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    }

    catch (error) {

      console.error(error);

      alert("Unable to download notice.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <button

      onClick={handleDownload}

      disabled={loading}

      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors duration-200 shadow-md shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed"

    >

      {

        loading ?

        <Loader2 className="w-4 h-4 animate-spin" />

        :

        <Download className="w-4 h-4" />

      }

      {

        loading ?

        "Downloading..."

        :

        "Download PDF"

      }

    </button>

  );

}