require('dotenv/config')

module.exports = {
  links: [
    {
      href: 'mailto:audrius.lubys@gmail.com',
      title: 'Email',
      image: 'img/at.svg',
    },
    {
      href: 'https://github.com/audriuslubys',
      title: 'GitHub Profile',
      image: 'img/octocat.svg',
    },
    {
      href: 'https://lt.linkedin.com/in/audriuslubys',
      title: 'LinkedIn Profile',
      image: 'img/in.svg',
    }
  ],
  env: Object.assign({}, process.env),
}
