import { permanentRedirect } from "next/navigation";
import { spanishForeclosurePath } from "@/lib/site";

export default function SpanishForeclosureRedirect() {
  permanentRedirect(spanishForeclosurePath);
}
