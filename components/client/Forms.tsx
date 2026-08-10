'use client';

import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/Icon';
import type { Content } from '@/lib/content';
import { waLink } from '@/lib/site';

function openWhatsApp(lines: string[]) {
  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
}

/** Hero filter bar. Hands the visitor's criteria straight to WhatsApp. */
export function SearchForm({ t }: { t: Content }) {
  const s = t.search;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const pick = (name: string, fallback: string) => (data.get(name) as string) || fallback;

    openWhatsApp([
      t.wa.greeting,
      '',
      t.wa.searchIntro,
      `• ${t.wa.labelType}: ${pick('type', s.typeOptions[0])}`,
      `• ${t.wa.labelArea}: ${pick('area', s.areaOptions[0])}`,
      `• ${t.wa.labelSize}: ${pick('size', s.sizeOptions[0])}`,
      `• ${t.wa.labelBudget}: ${pick('budget', s.budgetOptions[0])}`,
      '',
      t.wa.searchOutro,
      t.wa.sentFrom,
    ]);
  }

  const field = (id: string, name: string, label: string, options: string[]) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} defaultValue="">
        {options.map((o, i) => (
          <option key={o} value={i === 0 ? '' : o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form className="searchbar" id="searchForm" aria-label={s.formLabel} onSubmit={onSubmit}>
      {field('f-type', 'type', s.typeLabel, s.typeOptions)}
      {field('f-area', 'area', s.areaLabel, s.areaOptions)}
      {field('f-size', 'size', s.sizeLabel, s.sizeOptions)}
      {field('f-budget', 'budget', s.budgetLabel, s.budgetOptions)}
      <div className="field">
        <label htmlFor="f-go" className="visually-hidden">
          {s.submitSr}
        </label>
        <button className="btn btn--block" id="f-go" type="submit">
          {s.submit}
        </button>
      </div>
    </form>
  );
}

/** Contact form. Nothing is stored — it composes a WhatsApp message and opens it. */
export function EnquiryForm({ t }: { t: Content }) {
  const c = t.contact;
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get('name') as string)?.trim();
    const message = (data.get('message') as string)?.trim();

    if (!name || !message) {
      form.querySelector<HTMLElement>(name ? '#c-message' : '#c-name')?.focus();
      return;
    }

    setSent(true);
    openWhatsApp([
      t.wa.greeting,
      '',
      `${t.wa.labelName}: ${name}`,
      `${t.wa.labelPhone}: ${(data.get('phone') as string) || t.wa.notGiven}`,
      `${t.wa.labelWant}: ${data.get('purpose')}`,
      `${t.wa.labelArea}: ${data.get('area')}`,
      '',
      t.wa.labelDetails,
      message,
      '',
      t.wa.sentFrom,
    ]);
  }

  return (
    <form className="form" id="enquiryForm" style={{ marginTop: '1.2rem' }} noValidate onSubmit={onSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="c-name">{c.nameLabel}</label>
          <input id="c-name" name="name" type="text" autoComplete="name" required placeholder={c.namePlaceholder} />
        </div>
        <div className="field">
          <label htmlFor="c-phone">{c.phoneFieldLabel}</label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" placeholder={c.phonePlaceholder} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="c-purpose">{c.purposeLabel}</label>
          <select id="c-purpose" name="purpose">
            {c.purposeOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="c-area">{c.areaFieldLabel}</label>
          <select id="c-area" name="area">
            {c.areaOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-message">{c.detailsLabel}</label>
        <textarea id="c-message" name="message" required placeholder={c.detailsPlaceholder} />
      </div>

      <button className="btn btn--wa btn--block" type="submit">
        <Icon id="i-wa" solid /> {c.submit}
      </button>

      <p className="consent">{c.consent}</p>
      <p className={`form-status form-status--ok${sent ? ' is-visible' : ''}`} id="formStatus" role="status">
        {sent ? c.statusOk : ''}
      </p>
    </form>
  );
}
