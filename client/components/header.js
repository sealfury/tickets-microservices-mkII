import Link from 'next/link'

const Header = ({ currentUser }) => {
  // [] containing {} or false; filter false
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Ticket(s)', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className='nav-item'>
          <Link href={href}>
            <a className='nav-link active' aria-current='page'>
              {label}
            </a>
          </Link>
        </li>
      )
    })

  return (
    <nav className='navbar navbar-dark bg-dark'>
      <Link href='/'>
        <a className='navbar-brand' style={{ padding: '10px 20px' }}>
          SealTix
        </a>
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  )
}

export default Header
