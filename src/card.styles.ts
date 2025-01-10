import { css } from "lit";

export const styles = css`
  ha-card {
    padding: 1rem;
  }

  .vasttrafik-card-content {
    width: 100%;
    height: 200px;

    overflow: hidden;

    display: grid;
    grid-template-columns: repeat(8, auto);
    grid-template-rows: "auto 1fr";
  }

  /* Header */
  .header {
    width: 100%;
    height: 50px;

    display: grid;
    grid-column: span 8;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: 1fr auto;

    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 600;
  }

  .stop-name {
    width: 100%;

    padding: 0.5rem 0rem;

    grid-column: 1 / span 7;
  }

  .stop-name-timestamp {
    width: 100%;

    display: grid;
    place-items: center;

    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
  }

  .time-table-header {
    width: 100%;
    padding: 0.25rem 0rem;

    display: grid;
    grid-column: 1 / span 8;
    grid-template-columns: repeat(8, 1fr);
    place-items: center;

    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 400;
    text-align: center;
  }

  .time-table-heading {
    width: 100%;
    grid-column: span 1;
    text-align: center;
  }

  .direction {
    width: 100%;
    grid-column: span 4;
    text-align: left;
  }

  /* Time table */
  .time-table {
    width: 100%;
    height: 100%;

    overflow-y: auto;

    /* padding: 0 0 1rem 0; */
    margin: 1rem 0;

    display: grid;
    grid-column: span 8;
    grid-template-columns: repeat(8, 1fr);
    grid-auto-rows: 50px;
    row-gap: 4px;
    place-items: center;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .time-table-row {
    width: 100%;
    height: 50px;

    grid-column: 1 / span 8;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
  }

  .time-table-row-last {
    width: 100%;
    height: 100%;

    grid-column: 1 / span 8;
    display: grid;
    place-items: center;
  }

  .row-line-badge {
    width: 100%;

    grid-column: span 1;
    display: grid;
    place-items: center;

    color: #ffff50;
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: 0.025rem;

    box-sizing: border-box;
    border-style: solid;
    border-width: 0.25rem;
    border-color: #e0005b;

    background-color: #e0005b;
  }

  .row-platform {
    width: 100%;

    grid-column: span 1;
    display: grid;
    place-items: center;

    font-size: 1.25rem;
    line-height: 1.75;
    font-weight: 500;
  }

  .row-direction {
    width: 100%;

    grid-column: span 4;

    display: flex;
    align-items: center;
    justify-content: start;

    font-size: 1.125rem;
    line-height: 1.75;
    font-weight: 500;
  }

  .row-time-until-departure {
    width: 100%;

    grid-column: span 1;
    display: grid;
    place-items: center;

    font-size: 1.25rem;
    line-height: 1.75;
    font-weight: 600;
  }
`;
