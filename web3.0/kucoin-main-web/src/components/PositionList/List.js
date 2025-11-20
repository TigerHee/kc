/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { Box, Button } from '@kufox/mui';
import _ from 'lodash';
import arrow from 'static/join-us/arrow.svg';
import fire from 'static/join-us/fire.svg';
import GetChilds from 'components/HtmlToReact/GetChilds';
import Modal from './Modal';
import Pagination from './Pagination';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import PaginationLink from 'components/Seo/PaginationLink';

const Wrapper = styled(Box)`
  margin-top: ${px2rem(25)};
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${px2rem(15)};
  }
`;

const AccordionBox = styled.div`
  padding: ${px2rem(15)} 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  &:hover {
    cursor: pointer;
  }
`;

const AccordionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const JobTitle = styled.div`
  h3 {
    display: flex;
    align-items: center;
    margin: 0;
    font-size: ${px2rem(18)};
    line-height: ${px2rem(28)};
    ${(props) => props.theme.breakpoints.down('md')} {
      font-size: ${px2rem(14)};
    }
    ${(props) => props.theme.breakpoints.up('md')} {
      font-size: ${px2rem(18)};
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      font-size: ${px2rem(18)};
    }
    > span {
      &:nth-child(2) {
        display: flex;
        align-items: center;
        margin-left: 10px;
        padding: 0 6px;
        color: white;
        font-size: 12px;
        line-height: 18px;
        background: linear-gradient(180deg, #ff6868 0%, #ff5151 100%);
        border-radius: 2px;
      }
    }
  }
  p {
    margin: 0 ${px2rem(12)};
    color: ${(props) => props.theme.colors.text60};
    span {
      &:nth-child(2n) {
        font-size: ${px2rem(14)};
        &[data-role='divider'] {
          margin: 0 ${px2rem(12)};
        }
      ${(props) => props.theme.breakpoints.down('md')} {
        font-size: ${px2rem(12)};
      }
    }
  }
`;

const ApplyBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    white-space: nowrap;
  }
`;

const Arrow = styled.img`
  margin-left: ${px2rem(20)};
  transform: ${(props) => (props.active ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: all 0.3s linear;
  cursor: pointer;
`;

const AccordionBody = styled.div`
  padding: ${px2rem(16)} 0;
  transition: all 0.3s linear;
  p {
    min-height: ${px2rem(16)};
    margin: 0;
    padding: 0;
    font-size: ${px2rem(14)};
    span {
      color: rgba(74, 74, 74, 1);
    }
  }
  b {
    color: rgba(74, 74, 74, 1);
    font-weight: 700;
  }
  ul {
    margin-top: 12px;
    margin-right: 0;
    margin-bottom: 0;
    padding: 0 40px;
    list-style-position: outside;
    list-style-type: disc;
  }
`;

const Fire = styled.img`
  transform: ${(props) => (props.active ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: all 0.3s linear;
`;

const Accordion = (props) => {
  const { activeKeys, position = {}, handleClick, handleApply = () => {}, uniqId } = props;
  const {
    title,
    requirement,
    time_type,
    education,
    locations,
    language,
    is_spotlight_job,
    apply_url,
  } = position;
  const active = _.indexOf(activeKeys, uniqId) > -1;
  return (
    <AccordionBox
      data-role="box"
      onClick={(e) => {
        handleClick(uniqId, active, e);
      }}
    >
      <AccordionHead>
        <JobTitle>
          <h3>
            <span>{title}</span>
            {is_spotlight_job ? (
              <span>
                <Fire src={fire} />
                <span>Wanted Immediately</span>
              </span>
            ) : null}
          </h3>
          <p>
            <span>{time_type}</span>
            {education ? (
              <>
                <span data-role="divider">|</span>
                <span>{education}</span>
              </>
            ) : null}
            {locations ? (
              <>
                <span data-role="divider">|</span>
                <span>{locations}</span>
              </>
            ) : null}
            {language ? (
              <>
                <span data-role="divider">|</span>
                <span>{language}</span>
              </>
            ) : null}
          </p>
        </JobTitle>
        <ApplyBox>
          <Button size="small" variant="outlined" onClick={() => handleApply(apply_url)}>
            {_t('application.joinus.22')}
          </Button>
          <Arrow active={active} src={arrow} />
        </ApplyBox>
      </AccordionHead>
      {active ? (
        <AccordionBody>
          <GetChilds html={requirement} checkValid={true} />
        </AccordionBody>
      ) : null}
    </AccordionBox>
  );
};

export default (props) => {
  const dispatch = useDispatch();
  const [activeKeys, setActiveKeys] = useState([]);
  const [show, setShow] = useState(false);
  const handleClick = (id, active) => {
    let _activeKeys = [...activeKeys];
    if (!active) {
      _activeKeys = [...activeKeys, id];
    } else {
      _activeKeys = _.remove(_activeKeys, (n) => {
        return n !== id;
      });
    }
    setActiveKeys(_activeKeys);
  };
  const _activeKeys = _.uniq(activeKeys);
  const { currentList, currentCount, rowsPerPage, currentPage } = useSelector(
    (state) => state.jobs,
  );
  const _currentList = useMemo(() => {
    const fromIndex = currentPage * rowsPerPage;
    const entIndex = fromIndex + rowsPerPage;
    return currentList.slice(fromIndex, entIndex);
  }, [currentPage, rowsPerPage, currentList]);

  const onChangePage = useCallback(
    (page) => {
      push(`${props.location.pathname.replace(/\/\d+$/, '')}/${page + 1}`);
    },
    [props.location],
  );

  useEffect(() => {
    if (Number(props.page) !== Number(currentPage)) {
      setActiveKeys([]);
      dispatch({
        type: 'jobs/update',
        payload: {
          currentPage: props.page,
        },
      });
      window.scrollTo(0, 0);
    }
  }, [props.page, currentPage, dispatch]);

  const handleApply = useCallback((apply_url) => {
    window.open(`${apply_url}`, '_block');
  }, []);

  const baseUrl = window.location.href.replace(/\/\d+$/, '');

  return (
    <>
      <Wrapper>
        <Box>
          <PaginationLink
            baseUrl={baseUrl}
            firstPage={baseUrl}
            pagination={{ page: currentPage + 1, count: currentCount, pageSize: rowsPerPage }}
          />
          {_currentList.map((position, idx) => {
            return (
              <Accordion
                key={idx}
                uniqId={`${idx}_${position.category}`}
                activeKeys={_activeKeys}
                handleClick={(uniqId, active, e) => {
                  if (e.target.nodeName !== 'BUTTON') {
                    handleClick(uniqId, active);
                  }
                }}
                handleApply={handleApply}
                position={position}
              />
            );
          })}
        </Box>
        <Pagination
          page={currentPage}
          count={currentCount}
          rowsPerPage={rowsPerPage}
          onChangePage={onChangePage}
        />
      </Wrapper>
      {show ? (
        <Modal
          onClose={() => {
            setShow(false);
          }}
        />
      ) : null}
    </>
  );
};
