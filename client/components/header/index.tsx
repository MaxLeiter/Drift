import dynamic from 'next/dynamic'

const Header = dynamic(import('./header'), {
    // ssr: false,
    // loading: () => <MenuSkeleton />,
})



export default Header
