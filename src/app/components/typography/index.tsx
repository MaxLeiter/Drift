import { PropsWithChildren } from "react"
import { cn } from "@lib/cn"

type ClassProp = { className?: string }

export function TypographyH1({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<h1
			className={cn(
				"scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
				className
			)}
		>
			{children}
		</h1>
	)
}

export function TypographyH2({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<h2
			className={cn(
				"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
				className
			)}
		>
			{children}
		</h2>
	)
}

export function TypographyH3({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<h3
			className={cn(
				"scroll-m-20 text-2xl font-semibold tracking-tight",
				className
			)}
		>
			{children}
		</h3>
	)
}

export function TypographyH4({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<h4
			className={cn(
				"scroll-m-20 text-xl font-semibold tracking-tight",
				className
			)}
		>
			{children}
		</h4>
	)
}

export function TypographyP({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
			{children}
		</p>
	)
}

export function TypographyBlockquote({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
			{children}
		</blockquote>
	)
}

export function TypographyTable({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<div className={cn("my-6 w-full overflow-y-auto", className)}>
			<table className="w-full">{children}</table>
		</div>
	)
}

export function TableHead({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<thead className={className}>
			<tr className="m-0 border-t p-0 even:bg-muted">{children}</tr>
		</thead>
	)
}

export function TableBody({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return <tbody className={className}>{children}</tbody>
}

export function TableHeader({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<th
			className={cn(
				"border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
				className
			)}
		>
			{children}
		</th>
	)
}

export function TableRow({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<tr className={cn("m-0 border-t p-0 even:bg-muted", className)}>
			{children}
		</tr>
	)
}

export function TableCell({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<td
			className={cn(
				"border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
				className
			)}
		>
			{children}
		</td>
	)
}

export function TypographyList({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
			{children}
		</ul>
	)
}

export function TypographyInlineCode({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<code
			className={cn(
				"relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
				className
			)}
		>
			{children}
		</code>
	)
}

export function TypographyLead({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<p className={cn("text-xl text-muted-foreground", className)}>{children}</p>
	)
}

export function TypographyLarge({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<div className={cn("text-lg font-semibold", className)}>{children}</div>
	)
}

export function TypographySmall({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<small className={cn("text-sm font-medium leading-none", className)}>
			{children}
		</small>
	)
}

export function TypographyMuted({
	children,
	className
}: PropsWithChildren<ClassProp>) {
	return (
		<p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
	)
}
