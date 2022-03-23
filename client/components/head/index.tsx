import Head from "next/head";
import React from "react";

type PageSeoProps = {
    title?: string;
    description?: string;
    isLoading?: boolean;
    isPrivate?: boolean
};

const PageSeo = ({
    title = 'Drift',
    description = "A self-hostable clone of GitHub Gist",
    isPrivate = false
}: PageSeoProps) => {

    return (
        <>
            <Head>
                <title>{title}</title>
                {!isPrivate && <meta name="description" content={description} />}
            </Head>
        </>
    );
};

export default PageSeo;
