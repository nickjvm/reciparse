import withHeader from '@/components/withHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Reciparse'
}

function Page() {
  return (
    <div className="m-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-2xl font-bold">Cookie Policy</h1>

      <p className="mb-2">This is the Cookie Policy for Reciparse, accessible from www.reciparse.com</p>

      <p className="mb-2 text-lg"><strong>What Are Cookies</strong></p>

      <p className="mb-2">As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or &apos;break&apos; certain elements of the sites functionality.</p>

      <p className="mb-2 text-lg"><strong>How We Use Cookies</strong></p>

      <p className="mb-2">We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>

      <p className="mb-2 text-lg"><strong>Disabling Cookies</strong></p>

      <p className="mb-2">You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies. This Cookies Policy was created with the help of the <a href="https://www.cookiepolicygenerator.com/cookie-policy-generator/">Cookies Policy Generator</a>.</p>
      <p className="mb-2 text-lg"><strong>The Cookies We Set</strong></p>

      <ul>
        <li>
          <p className="mb-2 font-bold">Account related cookies</p>
          <p className="mb-2">If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.</p>
        </li>
        <li>
          <p className="mb-2 font-bold">Login related cookies</p>
          <p className="mb-2">We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</p>
        </li>
        <li>
          <p className="mb-2 font-bold">Site preferences cookies</p>
          <p className="mb-2">In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page is affected by your preferences.</p>
        </li>

      </ul>

      <p className="mb-2 text-lg"><strong>Third Party Cookies</strong></p>

      <p className="mb-2">In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>

      <ul>

        <li>
          <p className="mb-2">This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.</p>
          <p className="mb-2">For more information on Google Analytics cookies, see the official Google Analytics page.</p>
        </li>

        <li>
          <p className="mb-2">Third party analytics are used to track and measure usage of this site so that we can continue to produce engaging content. These cookies may track things such as how long you spend on the site or pages you visit which helps us to understand how we can improve the site for you.</p>
        </li>

        <li>
          <p className="mb-2">From time to time we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features these cookies may be used to ensure that you receive a consistent experience whilst on the site whilst ensuring we understand which optimisations our users appreciate the most.</p>
        </li>
      </ul>

      <p className="mb-2 text-lg"><strong>More Information</strong></p>

      <p className="mb-2">Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren&apos;t sure whether you need or not it&apos;s usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>

      <p className="mb-2">For more general information on cookies, please read <a href="https://www.cookiepolicygenerator.com/sample-cookies-policy/" target="_blank">this Cookies Policy article</a>.</p>

      <p className="mb-2">However if you are still looking for more information then you can contact us at cookies@reciparse.com.</p>

    </div>
  )
}

export default withHeader(Page, { withSearch: false })