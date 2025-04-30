import Footer from './Footer';
import Header from './Header';
import Navbar from './Navbar';
import { ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<div className='min-h-screen flex flex-col'>
			<Navbar />
			<Header />
			<div className='flex-grow'>{children}</div>
			<Footer />
		</div>
	);
};

export default Layout;
