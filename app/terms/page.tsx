import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BackButton } from "@/components/back-button"
import { ProtectedEmail } from "@/components/protected-email"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Statement to CSV",
  description: "Terms of Service for Statement to CSV by Vergos Limited.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
        <BackButton />
        <div className="prose prose-invert max-w-none space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Terms and Conditions
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: 2026-02-22
            </p>
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to pdfbankstatementtocsv ("Company", "we", "our", "us")!
              </p>
              <p className="text-muted-foreground">
                These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at https://www.pdfbankstatementtocsv.co.za/ (together or individually "Service") operated by pdfbankstatementtocsv.
              </p>
              <p className="text-muted-foreground">
                Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.
              </p>
              <p className="text-muted-foreground">
                Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound of them. If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at <ProtectedEmail email="vergos.ryan@gmail.com" /> so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">2. Communications</h2>
              <p className="text-muted-foreground">
                By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at <ProtectedEmail email="vergos.ryan@gmail.com" />.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">3. Purchases</h2>
              <p className="text-muted-foreground">
                If you wish to purchase any product or service made available through Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.
              </p>
              <p className="text-muted-foreground">
                You represent and warrant that: (i) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
              </p>
              <p className="text-muted-foreground">
                We may employ the use of third party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">4. Contests, Sweepstakes and Promotions</h2>
              <p className="text-muted-foreground">
                Any contests, sweepstakes or other promotions (collectively, "Promotions") made available through Service may be governed by rules that are separate from these Terms of Service. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of Service, Promotion rules will apply.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">5. Subscriptions</h2>
              <p className="text-muted-foreground">
                Some parts of Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles will be set depending on the type of subscription plan you select when purchasing a Subscription.
              </p>
              <p className="text-muted-foreground">
                At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or pdfbankstatementtocsv cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting <ProtectedEmail email="vergos.ryan@gmail.com" /> customer support team.
              </p>
              <p className="text-muted-foreground">
                A valid payment method is required to process the payment for your subscription. You shall provide pdfbankstatementtocsv with accurate and complete billing information that may include but not limited to full name, address, state, postal or zip code, telephone number, and a valid payment method information. By submitting such payment information, you automatically authorize pdfbankstatementtocsv to charge all Subscription fees incurred through your account to any such payment instruments.
              </p>
              <p className="text-muted-foreground">
                Should automatic billing fail to occur for any reason, pdfbankstatementtocsv reserves the right to terminate your access to the Service with immediate effect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">6. Free Trial</h2>
              <p className="text-muted-foreground">
                pdfbankstatementtocsv may, at its sole discretion, offer a Subscription with a free trial for a limited period of time ("Free Trial").
              </p>
              <p className="text-muted-foreground">
                You may be required to enter your billing information in order to sign up for Free Trial. If you do enter your billing information when signing up for Free Trial, you will not be charged by pdfbankstatementtocsv until Free Trial has expired. On the last day of Free Trial period, unless you cancelled your Subscription, you will be automatically charged the applicable Subscription fees for the type of Subscription you have selected.
              </p>
              <p className="text-muted-foreground">
                At any time and without notice, pdfbankstatementtocsv reserves the right to (i) modify Terms of Service of Free Trial offer, or (ii) cancel such Free Trial offer.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">7. Fee Changes</h2>
              <p className="text-muted-foreground">
                pdfbankstatementtocsv, in its sole discretion and at any time, may modify Subscription fees for the Subscriptions. Any Subscription fee change will become effective at the end of the then-current Billing Cycle.
              </p>
              <p className="text-muted-foreground">
                pdfbankstatementtocsv will provide you with a reasonable prior notice of any change in Subscription fees to give you an opportunity to terminate your Subscription before such change becomes effective.
              </p>
              <p className="text-muted-foreground">
                Your continued use of Service after Subscription fee change comes into effect constitutes your agreement to pay the modified Subscription fee amount.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">8. Refunds</h2>
              <p className="text-muted-foreground">
                We issue refunds for Contracts within 30 days of the original purchase of the Contract.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">9. Content</h2>
              <p className="text-muted-foreground">
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for Content that you post on or through Service, including its legality, reliability, and appropriateness.
              </p>
              <p className="text-muted-foreground">
                By posting Content on or through Service, You represent and warrant that: (i) Content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.
              </p>
              <p className="text-muted-foreground">
                You retain any and all of your rights to any Content you submit, post or display on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through Service. However, by posting Content using Service you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service.
              </p>
              <p className="text-muted-foreground">
                You agree that this license includes the right for us to make your Content available to other users of Service, who may also use your Content subject to these Terms. pdfbankstatementtocsv has the right but not the obligation to monitor and edit all Content provided by users.
              </p>
              <p className="text-muted-foreground">
                In addition, Content found on or through this Service are the property of pdfbankstatementtocsv or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">10. Prohibited Uses</h2>
              <p className="text-muted-foreground">
                You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:
              </p>
              <ul className="list-inside space-y-2 text-muted-foreground">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
                <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.</li>
              </ul>
              <p className="text-muted-foreground mt-3 font-semibold">Additionally, you agree not to:</p>
              <ul className="list-inside space-y-2 text-muted-foreground">
                <li>Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with any other party's use of Service, including their ability to engage in real time activities through Service.</li>
                <li>Use any robot, spider, or other automatic device, process, or means to access Service for any purpose, including monitoring or copying any of the material on Service.</li>
                <li>Use any manual process to monitor or copy any of the material on Service or for any other unauthorized purpose without our prior written consent.</li>
                <li>Use any device, software, or routine that interferes with the proper working of Service.</li>
                <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</li>
                <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the server on which Service is stored, or any server, computer, or database connected to Service.</li>
                <li>Attack Service via a denial-of-service attack or a distributed denial-of-service attack.</li>
                <li>Take any action that may damage or falsify Company rating.</li>
                <li>Otherwise attempt to interfere with the proper working of Service.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">11. Analytics</h2>
              <p className="text-muted-foreground">
                We may use third-party Service Providers to monitor and analyze the use of our Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">12. No Use By Minors</h2>
              <p className="text-muted-foreground">
                Service is intended only for access and use by individuals at least eighteen (18) years old. By accessing or using Service, you warrant and represent that you are at least eighteen (18) years of age and with the full authority, right, and capacity to enter into this agreement and abide by all of the terms and conditions of Terms. If you are not at least eighteen (18) years old, you are prohibited from both the access and usage of Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">13. Accounts</h2>
              <p className="text-muted-foreground">
                When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on Service.
              </p>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our Service or a third-party service.
              </p>
              <p className="text-muted-foreground">
                You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
              <p className="text-muted-foreground">
                You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you, without appropriate authorization. You may not use as a username any name that is offensive, vulgar or obscene.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">14. Intellectual Property</h2>
              <p className="text-muted-foreground">
                Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of pdfbankstatementtocsv and its licensors. Service is protected by copyright, trademark, and other laws of and foreign countries. Our trademarks may not be used in connection with any product or service without the prior written consent of pdfbankstatementtocsv.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">15. Copyright Policy</h2>
              <p className="text-muted-foreground">
                We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights ("Infringement") of any person or entity.
              </p>
              <p className="text-muted-foreground">
                If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to <ProtectedEmail email="vergos.ryan@gmail.com" />, with the subject line: "Copyright Infringement" and include in your claim a detailed description of the alleged Infringement as detailed below, under "DMCA Notice and Procedure for Copyright Infringement Claims"
              </p>
              <p className="text-muted-foreground">
                You may be held accountable for damages (including costs and attorneys' fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through Service on your copyright.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">16. DMCA Notice and Procedure for Copyright Infringement Claims</h2>
              <p className="text-muted-foreground">
                You may submit a notification pursuant to the Digital Millennium Copyright Act (DMCA) by providing our Copyright Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further detail):
              </p>
              <ul className="list-inside space-y-2 text-muted-foreground">
                <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest.</li>
                <li>A description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work.</li>
                <li>Identification of the URL or other specific location on Service where the material that you claim is infringing is located.</li>
                <li>Your address, telephone number, and email address.</li>
                <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                You can contact our Copyright Agent via email at <ProtectedEmail email="vergos.ryan@gmail.com" />.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">17. Error Reporting and Feedback</h2>
              <p className="text-muted-foreground">
                You may provide us either directly at <ProtectedEmail email="vergos.ryan@gmail.com" /> or via third party sites and tools with information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints, and other matters related to our Service ("Feedback"). You acknowledge and agree that: (i) you shall not retain, acquire or assert any intellectual property right or other right, title or interest in or to the Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain confidential information or proprietary information from you or any third party; and (iv) Company is not under any obligation of confidentiality with respect to the Feedback. In the event the transfer of the ownership to the Feedback is not possible due to applicable mandatory laws, you grant Company and its affiliates an exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and perpetual right to use (including copy, modify, create derivative works, publish, distribute and commercialize) Feedback in any manner and for any purpose.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">18. Links To Other Web Sites</h2>
              <p className="text-muted-foreground">
                Our Service may contain links to third party web sites or services that are not owned or controlled by pdfbankstatementtocsv.
              </p>
              <p className="text-muted-foreground">
                pdfbankstatementtocsv has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third party web sites or services. We do not warrant the offerings of any of these entities/individuals or their websites.
              </p>
              <p className="text-muted-foreground">
                For example, the outlined Terms of Use have been created using PolicyMaker.io, a free web application for generating high-quality legal documents. PolicyMaker's Terms and Conditions generator is an easy-to-use free tool for creating an excellent standard Terms of Service template for a website, blog, e-commerce store or app.
              </p>
              <div className="p-4 bg-secondary/50 rounded-lg mt-3">
                <p className="text-muted-foreground">
                  YOU ACKNOWLEDGE AND AGREE THAT COMPANY SHALL NOT BE RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY, FOR ANY DAMAGE OR LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE OF OR RELIANCE ON ANY SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON OR THROUGH ANY SUCH THIRD PARTY WEB SITES OR SERVICES. WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND PRIVACY POLICIES OF ANY THIRD PARTY WEB SITES OR SERVICES THAT YOU VISIT.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">19. Disclaimer Of Warranty</h2>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-muted-foreground">
                  THESE SERVICES ARE PROVIDED BY COMPANY ON AN "AS IS" AND "AS AVAILABLE" BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.
                </p>
                <p className="text-muted-foreground mt-3">
                  NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER COMPANY NOR ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
                </p>
                <p className="text-muted-foreground mt-3">
                  COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.
                </p>
                <p className="text-muted-foreground mt-3">
                  THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">20. Limitation Of Liability</h2>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-muted-foreground">
                  EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING ATTORNEYS' FEES AND ALL RELATED COSTS AND EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL, IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO THE AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES.
                </p>
                <p className="text-muted-foreground mt-3">
                  SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE, INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">21. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.
              </p>
              <p className="text-muted-foreground">
                If you wish to terminate your account, you may simply discontinue using Service.
              </p>
              <p className="text-muted-foreground">
                All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">22. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed and construed in accordance with the laws of New Zealand, which governing law applies to agreement without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">23. Disputes Resolution</h2>
              <p className="text-muted-foreground">
                If you have any concern or dispute about the Service, you agree to first try to resolve the dispute informally by contacting the Company.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">24. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms and Conditions, please contact us by email at <ProtectedEmail email="vergos.ryan@gmail.com" />.
              </p>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
