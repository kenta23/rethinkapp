import Link from 'next/link'
import React from 'react'

export default function TermsAndCondition() {
  return (
    <>
        <p className="font-medium mb-3">
          These Terms and Conditions apply to your use of the ReThink website.
          You accept these Terms by using or accessing this website. You are not
          permitted to use the Website if you disagree with any part of the
          Terms.
        </p>
        <ol className='space-y-2'>

          <ul className='space-y-2'>
            <h5>
              1.Use of Service
            </h5>
            <ol type="a" >
              <li>
                <p>
                 1.1 ReThink offers a platform where users can upload PDF files for
                  scanning and receive responses to inquiries about the PDFs
                  content.
                </p>
              </li>
              <li>
                <p>
                 1.2 Through your use of this website, you agree to avoid uploading
                  any PDF files that violate third-party rights, such as
                  copyright, trademarks, privacy, or other intellectual or
                  personal rights.
                </p>
              </li>
              <li>
                <p>
                 1.3 You pledge to abide by these Terms and will not use the
                  Website for any illegal purposes.
                </p>
              </li>
            </ol>
          </ul>
          
          <ul className='space-y-2'>
            <h5>
              2.User Responsibilities
            </h5>
            <ol type="a" >
              <li>
                <p>
                 2.1 You are solely responsible for the PDF files you upload to the
                  Website. ReThink does not assume any responsibility or
                  liability for the content of the PDF files uploaded by users.
                </p>
              </li>
              <li>
                <p>
                 2.2 You acknowledge that the responses offered by the Website
                  should only be used for informational purposes and should
                  never be used in place of expert advice or discretion.
                </p>
              </li>
              <li>
                <p>
                 2.3 You agree to abstain from uploading, transmitting, or
                  disseminating any content that is illegal, dangerous, obscene,
                  abusive, harassing, defamatory, vulgar, or otherwise
                  objectionable on the Website.
                </p>
              </li>
            </ol>
          </ul>


          <ul className='space-y-2'>
            <h5>
              3.Limitation of Liability
            </h5>
            <ol type="a" >
              <li>
                <p>
                 3.1 ReThink shall not be liable for any damages—direct, indirect,
                  incidental, special, consequential, or punitive—that result
                  from your use of the website or any of its content.
                </p>
              </li>
              <li>
                <p>
                 3.2 ReThink makes no assurance that the Website will be
                  uninterrupted or error-free, nor does it make any warranty
                  about the accuracy, completeness, or reliability of any
                  content acquired from the Website.
                </p>
              </li>
            </ol>
          </ul>


          <ul className='space-y-2'>
            <h5>
               4.Indemnification
            </h5>
            <p>
              You agree to indemnify and hold harmless ReThink, its affiliates,
              officers, directors, employees, agents, and licensors from and
              against any and all claims, liabilities, damages, losses, costs,
              or expenses (including reasonable attorneys fees) arising from or
              in any way related to your use of the Website or violation of
              these Terms.
            </p>
          </ul>


          <ul className='space-y-2'>
            <h5>
               Modifications to Terms
            </h5>
            <p>
              ReThink has the right to amend these Terms at any moment without
              prior notice. By continuing to use the Website following such
              changes, you agree to be bound by the new Terms.
            </p>
          </ul>
        </ol>

        <p className='mt-3'>
          <strong>Contact Us</strong> If you have any questions or concerns
          about these Terms, please contact us at our email <Link href={'/'} className='hover:underline text-blue-600'>here. </Link>
          By using the ReThink website, you acknowledge that you have read,
          understood, and agree to be bound by these Terms.
        </p>
      </>
  )
}
