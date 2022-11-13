"use client";

import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";

export default function MDXRemoteWrapper(props: MDXRemoteProps) {
  return <MDXRemote {...props} />;
}
