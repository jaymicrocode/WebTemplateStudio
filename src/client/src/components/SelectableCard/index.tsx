import classNames from "classnames";
import * as React from "react";

import { Link } from "react-router-dom";
import { injectIntl, InjectedIntl, defineMessages } from "react-intl";

import CardBody from "../CardBody";
import CardTitle from "../CardTitle";
import DependencyInfo from "../../containers/DependencyInfo";
import { ReactComponent as Check } from "../../assets/check.svg";

import grid from "../../css/grid.module.css";
import styles from "./styles.module.css";

import { IOption } from "../../types/option";

import { ROUTES, KEY_EVENTS } from "../../utils/constants";
import { getSvg } from "../../utils/getSvgUrl";

import { ReactComponent as Plus } from "../../assets/plus.svg";

import keyUpHandler from "../../utils/keyUpHandler";
import messages from "./messages";
const SelectableCard = ({
  iconPath,
  iconStyles,
  title,
  body,
  version,
  selected,
  cardNumber,
  onCardClick,
  option,
  onDetailsClick,
  clickCount,
  disabled,
  isFrameworkSelection,
  isPagesSelection,
  addPage,
  showLink,
  intl
}: {
  iconPath: string | undefined;
  iconStyles: string;
  title: string;
  body: string;
  version?: string;
  selected: boolean;
  option: IOption;
  cardNumber: number;
  onCardClick: (idx: number) => void;
  onDetailsClick: (detailPageInfo: IOption) => void;
  clickCount?: number;
  disabled: boolean | undefined;
  isFrameworkSelection: boolean;
  isPagesSelection: boolean;
  addPage: (idx: number) => void;
  showLink: boolean;
  intl: InjectedIntl;
}) => {
  const [isShown, setIsShown] = React.useState(false);

  function detailsClickWrapper(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    event.stopPropagation();
    onDetailsClick(option);
  }

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === KEY_EVENTS.ENTER || event.key === KEY_EVENTS.SPACE) {
      onCardClick(cardNumber);
    }
  };

  

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onCardClick(cardNumber);
        addPage(cardNumber);
      }}
      onKeyDown={keyDownHandler}
      className={classNames(styles.container, styles.boundingBox, {
        [styles.selected]: selected,
        [styles.unselectable]: disabled
      })}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div>
        <div className={styles.gridLayoutCardHeader}>
          <div>
            {getSvg(option.internalName, iconStyles) ||
              (iconPath && (
                <img src={iconPath} className={iconStyles} alt="" />
              ))}
          </div>
          <div
            className={classNames({
              [styles.title]: iconPath,
              [styles.titleLeftJustified]: iconPath === undefined ? true : false
            })}
          >
            <CardTitle title={title} />
          </div>
          {isPagesSelection && isShown &&(
            <div className={styles.pageButtons}>
            <button
              className={classNames(styles.cardCount, styles.countButton)}
            >
              <Plus />
            </button>
            </div>
          )}
        </div>
        {isFrameworkSelection && selected && (
          <DependencyInfo frameworkName={option.internalName} />
        )}
        <div className={grid.row}>
          <div className={styles.body}>
            {version ? (
              <CardBody body={body} version={version} />
            ) : (
              <CardBody body={body} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.gridLayoutCardFooter}>
        {showLink && (
          <Link
            onClick={detailsClickWrapper}
            className={styles.link}
            to={ROUTES.PAGE_DETAILS}
            onKeyUp={keyUpHandler}
          >
            {isPagesSelection
              ? intl.formatMessage(messages.preview)
              : intl.formatMessage(messages.learnMore)}
          </Link>
        )}
        <div className={styles.pageCounter}>
          <div
            className={classNames({
              [styles.hidden]: !selected && !isPagesSelection,
              [styles.selectedCheckMark]: selected && !clickCount,
              [styles.showCount]: isPagesSelection
            })}
          >
            {(isPagesSelection && (
              <section
                aria-label={intl.formatMessage(messages.pageCount, {
                  number: clickCount,
                  page: clickCount == 1 ? "page" : "pages"
                })}
              >
                {clickCount}
              </section>
            )) || (
              <div className={styles.selectedText}>
                <Check className={styles.iconCheckMark} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(SelectableCard);
