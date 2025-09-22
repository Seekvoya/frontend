import React from "react"

const Header = ({ user, balance }) => {
	return (
		<>
			<header className='header'>
				<div className='logo'>overcards</div>
				<div className='balance-info'>
					<span>{balance || "0"} USD</span>
					<span>{user || "Гость"}</span>
				</div>
			</header>
		</>
	)
}

export default Header
