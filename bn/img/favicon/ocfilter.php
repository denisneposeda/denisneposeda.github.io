<?php

class ControllerExtensionModuleOCFilter extends Controller {
  protected $registry;
  protected $data = array();
  public $cache_links = array();
  public $cache_sql = array();
  public $cache_page = array();

  public function __construct($registry) {
    parent::__construct($registry);
$this->load->helper('functions');
    if ($this->registry->has('ocfilter')) {
      $this->data = $this->registry->get('ocfilter')->data;
      //$this->cache_links = $this->registry->get('ocfilter')->cache_links;
      $this->cache_sql = $this->registry->get('ocfilter')->cache_sql;
      $this->cache_page = $this->registry->get('ocfilter')->cache_page;
      return;
    }

    $this->load->language('extension/module/ocfilter');

    $this->load->config('ocfilter');
    $this->load->helper('ocfilter');

  	$this->load->model('catalog/ocfilter');
		$this->load->model('catalog/product');
    $this->load->model('tool/image');

    // Decode URL
    $this->decode();

    if (!$this->path) {
    	return;
    }

    $parts = explode('_', $this->path);

    $this->category_id = (int)end($parts);

    if (isset($this->request->get['filter_ocfilter'])) {
      $this->params = cleanParamsString($this->request->get['filter_ocfilter'], $this->config);

      if ($this->params) {
        $options_get = decodeParamsFromString($this->params, $this->config);

  			$this->options_get = $options_get;

        if ($this->config->get('ocfilter_show_price') && !empty($options_get['p'])) {
          $range = getRangeParts(end($options_get['p']));

          if (isset($range['from']) && isset($range['to'])) {
          	$this->min_price_get = $range['from'];
          	$this->max_price_get = $range['to'];
          }
        }

        if (!$this->page_info) {
         	$this->document->setNoindex(true);
        }
      }
    }

    // Get values counter
    $filter_data = array(
			'filter_category_id' => $this->category_id,
      'filter_ocfilter' => $this->params
		);

		$this->counters = $this->model_catalog_ocfilter->getCounters($filter_data);

    if ($this->config->get('ocfilter_show_price')) {
      $filter_data['filter_ocfilter'] = $this->cancelOptionParams('p');

      $this->product_prices = $this->model_catalog_ocfilter->getProductPrices($filter_data);

      if ($this->product_prices) {
        $this->min_price = $this->currency->format(floor($this->product_prices['min']), $this->session->data['currency'], '', false);
        $this->max_price = $this->currency->format(ceil($this->product_prices['max']), $this->session->data['currency'], '', false);
      }
    }

    $this->registry->set('ocfilter', $this);
  }

  // Array access
  public function __get($key) {
    if (isset($this->data[$key])) {
      return $this->data[$key];
    } else if ($this->registry->has($key)) {
      return $this->registry->get($key);
    } else {
      return null;
    }
  }

  public function __set($key, $value) {
    $this->data[$key] = $value;
  }

  // Empty method to prevent execution of index()
  public function initialise() {

  }

	public function index($settings = array()) {
    if (!$this->category_id) {
    	return;
    }

    $data = $this->load->language('extension/module/ocfilter');

    if ($this->config->get('ocfilter_show_price') && $this->min_price < $this->max_price - 1) {
      $data['show_price'] = 1;
    } else {
      $data['show_price'] = 0;
    }

    $data['heading_title'] = $this->language->get('heading_title');

		if ($this->min_price_get && $this->min_price_get < $this->min_price) {
			$this->min_price = $this->min_price_get;
    }

		if ($this->max_price_get && $this->max_price_get > $this->max_price) {
			$this->max_price = $this->max_price_get;
    }

    $data['options']              = $this->getOCFilterOptions();
    $data['min_price']            = $this->min_price;
		$data['max_price']            = $this->max_price;
    $data['min_price_get']        = $this->min_price_get ? $this->min_price_get : $this->min_price;
    $data['max_price_get']        = $this->max_price_get ? $this->max_price_get : $this->max_price;
    $data['path']                 = $this->path;

    $data['link']                 = str_replace('&amp;', '&', $this->link());

    $data['params']               = $this->params;

    $data['index']   							= $this->config->get('ocfilter_url_index');
    $data['show_counter']         = $this->config->get('ocfilter_show_counter');
    $data['search_button']        = $this->config->get('ocfilter_search_button');
    $data['show_values_limit']   	= $this->config->get('ocfilter_show_values_limit');
    $data['manual_price']         = $this->config->get('ocfilter_manual_price');

    $data['text_show_all']        = $this->language->get('text_show_all');
    $data['text_hide']          	= $this->language->get('text_hide');
    $data['button_select']        = $this->language->get('button_select');
    $data['text_load']            = $this->language->get('text_load');
    $data['text_price']           = $this->language->get('text_price');
    $data['text_any']           	= $this->language->get('text_any');
    $data['text_cancel_all']      = $this->language->get('text_cancel_all');

    $data['symbol_left']      		= $this->currency->getSymbolLeft($this->session->data['currency']);
    $data['symbol_right']      		= $this->currency->getSymbolRight($this->session->data['currency']);

    $data['show_options'] = !empty($this->params);

    if ($this->config->get('ocfilter_show_selected') && $this->options_get) {
      $data['selecteds'] = $this->getSelectedOptions();
    } else {
      $data['selecteds'] = array();
    }

		if ($this->config->get('ocfilter_show_options_limit') && $this->config->get('ocfilter_show_options_limit') < count($data['options'])) {
    	$data['show_options_limit'] = $this->config->get('ocfilter_show_options_limit');
		} else {
      $data['show_options_limit'] = false;
		}

    $this->document->addStyle('catalog/view/javascript/ocfilter/nouislider.min.css');
    $this->document->addStyle('catalog/view/theme/default/stylesheet/ocfilter/ocfilter.css');

    $this->document->addScript('catalog/view/javascript/ocfilter/nouislider.min.js');
    $this->document->addScript('catalog/view/javascript/ocfilter/ocfilter.js');
    
        $data['module_code'] = $settings['module_code'];
        $data['module_column'] = $settings['module_column'];
        
        
        if (strpos($data['module_column'],'override=')===0){
            $v = trim(str_replace('override=','',$data['module_column'])).'.tpl';
            if($this->registry->get('customer')->isPartner()) {
                if (view_exists('override/b2b/'.$v,false))
                return $this->load->view('override/b2b/'.$v, $data);  
            } else {
                if (view_exists('override/ocfilter/'.$v,false))
                return $this->load->view('override/ocfilter/'.$v, $data);              
            }
        }
		return $this->load->view('extension/module/ocfilter/module', $data);
	}

	protected function getOCFilterOptions() {
    if (!is_null($this->options)) {
    	return $this->options;
    }

    $options = array();

    // Get category options
	  $results = $this->model_catalog_ocfilter->getOCFilterOptionsByCategoryId($this->category_id);

    if ($results) {
	 		$options = array_merge($options, $results);
		}
    // Manufacturers filtering
    if ($this->config->get('ocfilter_manufacturer')) {
  		$results = $this->model_catalog_ocfilter->getManufacturersByCategoryId($this->category_id);

      if ($results) {
        $options['m'] = array(
          'option_id'   => 'm',
          'name'        => $this->language->get('text_manufacturer'),
          'description' => $this->language->get('text_manufacturer_description'),
          'type'        => $this->config->get('ocfilter_manufacturer_type'),
          'values'      => $results
        );
      }
    }

    // Stock status filtering
    if ($this->config->get('ocfilter_stock_status')) {
			if ($this->config->get('ocfilter_stock_status_method') == 'stock_status_id') {
				$results = $this->model_catalog_ocfilter->getStockStatuses();

	      $options['stock'] = array(
	        'option_id'   => 's',
	        'name'        => $this->language->get('text_stock'),
          'description' => $this->language->get('text_stock_description'),
	        'type'        => $this->config->get('ocfilter_stock_status_type'),
	        'values'      => $results
	      );
			} else if ($this->config->get('ocfilter_stock_status_method') == 'quantity') {
	      $options['stock'] = array(
	        'option_id'   => 's',
	        'name'        => $this->language->get('text_stock'),
          'description' => $this->language->get('text_stock_description'),
	        'type'        => ($this->config->get('ocfilter_stock_out_value') ? 'radio' : 'checkbox'),
	        'values'      => array(
						array(
							'value_id'    => 'in',
							'name'        => 'Все товары'
						)
					)
	      );

				if ($this->config->get('ocfilter_stock_out_value')) {
          $options['stock']['values'][] = array(
						'value_id'    => 'out',
						'name'        => $this->language->get('text_out_of_stock')
					);
				}
			}
    }
    
    $options_data = array();

    $index = 0;

	  foreach ($options as $key => $option) {
      if ($option['type'] == 'select') {
        $option['type'] = 'radio';
        $option['selectbox'] = true;
      }

      $this_option = isset($this->options_get[$option['option_id']]);

			$values = array();

      if ($option['type'] != 'slide' && $option['type'] != 'slide_dual') {
				foreach ($option['values'] as $value) {
					$this_value = isset($this->options_get[$option['option_id']]) && in_array($value['value_id'], $this->options_get[$option['option_id']]);

          $count = 0;

					if (isset($this->counters[$option['option_id'] . $value['value_id']])) {
						if ($this_option && $option['type'] == 'checkbox') {
							$count = '+' . $this->counters[$option['option_id'] . $value['value_id']];
						} else {
							$count = $this->counters[$option['option_id'] . $value['value_id']];
						}
					}

          if ($count || !$this->config->get('ocfilter_hide_empty_values')) {
						if (isset($option['image']) && $option['image'] && isset($value['image']) && $value['image'] && file_exists(DIR_IMAGE . $value['image'])) {
              $image = $this->model_tool_image->resize($value['image'], 19, 19);
						} else {
							$image = false;
						}

            $params = $this->getValueParams($option['option_id'], $value['value_id'], $option['type']);

	          $values[] = array(
	            'value_id' => $value['value_id'],
							'id'       => $option['option_id'] . $value['value_id'],
	            'name'     => html_entity_decode($value['name'] . (isset($option['postfix']) ? $option['postfix'] : ''), ENT_QUOTES, 'UTF-8'),
              'keyword'  => html_entity_decode((isset($value['keyword']) ? $value['keyword'] : $value['value_id']), ENT_QUOTES, 'UTF-8'),
							'color'    => ((isset($value['color']) && $value['color']) ? $value['color'] : '#FFFFFF'),
              'image'    => $image,
	            'params'   => $params,
							'count'    => $count,
	            'selected' => $this_value
	          );
					}
        }

        if (!$values) {
        	continue;
        }
      } else {
        $range = $this->model_catalog_ocfilter->getSliderRange($option['option_id'], array(
    			'filter_category_id' => $this->category_id,
          'filter_ocfilter' => $this->cancelOptionParams($option['option_id']),
        ));

        if ($range['min'] == $range['max']) {
        	continue;
        }

        $option['slide_value_min'] = $range['min'];
        $option['slide_value_max'] = $range['max'];
      }

      if ($option['type'] == 'radio') {
        $params = $this->cancelOptionParams($option['option_id']);

				if (isset($this->counters[$option['option_id'] . 'all'])) {
					$count = $this->counters[$option['option_id'] . 'all'];
				} else {
					$count = 1;
				}

        array_unshift($values, array(
          'value_id' => $option['option_id'],
					'id'       => 'cancel-' . $option['option_id'],
          'name'     => $this->language->get('text_any'),
          'params'   => $params,
					'count'    => $count,
          'selected' => !$this_option
        ));
			}

      $option_data = array(
        'option_id'           => $option['option_id'],
        'index'               => ++$index,
       	'name'                => html_entity_decode($option['name'], ENT_QUOTES, 'UTF-8'),
        'selectbox'           => (isset($option['selectbox']) ? $option['selectbox'] : false),
        'color'			          => (isset($option['color']) ? $option['color'] : false),
        'image'		            => (isset($option['image']) ? $option['image'] : false),
        'keyword'		          => (isset($option['keyword']) ? $option['keyword'] : $option['option_id']),
				'postfix' 		        => (isset($option['postfix']) ? html_entity_decode($option['postfix'], ENT_QUOTES, 'UTF-8') : ''),
        'description'         => (isset($option['description']) ? $option['description'] : ''),
        'slide_value_min'     => (isset($option['slide_value_min']) ? $option['slide_value_min'] : 0),
        'slide_value_max'     => (isset($option['slide_value_max']) ? $option['slide_value_max'] : 0),
        'slide_value_min_get' => (isset($option['slide_value_min']) ? $option['slide_value_min'] : 0),
        'slide_value_max_get' => (isset($option['slide_value_max']) ? $option['slide_value_max'] : 0),
        'type'                => $option['type'],
        'selected'            => $this_option,
        'values'              => $values
      );

      if (($option['type'] == 'slide' || $option['type'] == 'slide_dual') && isset($this->options_get[$option['option_id']][0])) {
        $range = getRangeParts($this->options_get[$option['option_id']][0]);

        if (isset($range['from']) && isset($range['to'])) {
          $option_data['slide_value_min_get'] = $range['from'];
          $option_data['slide_value_max_get'] = $range['to'];

          // For getSelectedOptions
          array_unshift($option_data['values'], array(
            'value_id' => $range['from'] . '-' . $range['to'],
            'name'     => 'от ' . $range['from'] . ' до ' . $range['to'] . $option['postfix']
          ));
        }
      }

      $options_data[$option['option_id']] = $option_data;
    } // End options each

    $this->options = $options_data;

    return $options_data;
  }

	protected function getValueParams($option_id, $value_id, $type = 'checkbox') {
		$decoded_params = decodeParamsFromString($this->params, $this->config);

		if ($type == 'checkbox') {
			if (isset($decoded_params[$option_id])) {
				if (false !== $key = array_search($value_id, $decoded_params[$option_id])) {
					unset($decoded_params[$option_id][$key]);
				} else {
					$decoded_params[$option_id][] = $value_id;
				}
			} else {
				$decoded_params[$option_id] = array($value_id);
			}
 		} else if ($type == 'select' || $type == 'radio') {
			if (isset($decoded_params[$option_id])) {
				unset($decoded_params[$option_id]);
			}

			$decoded_params[$option_id] = array($value_id);
		}

		return encodeParamsToString($decoded_params, $this->config);
	}

  protected function cancelOptionParams($option_id) {
    if ($this->params) {
			$params = decodeParamsFromString($this->params, $this->config);

			if (isset($params[$option_id])) {
				unset($params[$option_id]);
			}

			return encodeParamsToString($params, $this->config);
    }
  }

  protected function getSelectedOptions() {
    $selected_options = array();

    $category_options = $this->getOCFilterOptions();

    if ($this->min_price_get && $this->max_price_get) {
      $category_options[] = array(
        'option_id' => 'p',
        'name'      => $this->language->get('text_price'),
				'type'      => 'select',
        'selected'  => isset($this->options_get['p']),
        'values'    => array(array(
					'value_id' 	=> $this->min_price_get . '-' . $this->max_price_get,
          'name' 			=> 'от ' . $this->currency->getSymbolLeft($this->session->data['currency']) . $this->min_price_get . ' до ' . $this->max_price_get . $this->currency->getSymbolRight($this->session->data['currency'])
				))
      );
    }

		foreach ($category_options as $option) {
			if (!$option['selected']) {
				continue;
			}

      $option_id = $option['option_id'];

			$values = array();

			foreach ($option['values'] as $value) {
        if (!in_array($value['value_id'], $this->options_get[$option_id])) {
          continue;
				}

			  $params = '';

        if (count($this->options_get) > 1 || count($this->options_get[$option_id]) > 1) {
          if ($option['type'] == 'radio' || $option['type'] == 'select' || $option['type'] == 'slide' || $option['type'] == 'slide_dual') {
            $params .= $this->cancelOptionParams($option_id);
          } else {
            $params .= $value['params'];
          }
        }

        $name = html_entity_decode($value['name'], ENT_QUOTES, 'UTF-8');

			  $values[] = array(
          'name' => $name,
          'id'   => $option_id . $value['value_id'],
          'href' => $this->link($params),
        );
			}

			$selected_options[$option_id] = array(
        'name'   		=> $option['name'],
        'values' 		=> $values
      );
		}
//!d($selected_options);
    return $selected_options;
  }

  public function decode() {
    if (isset($this->request->get['path'])) {
      $this->path = $this->request->get['path'];
    }

    if (!isset($this->request->get['_route_'])) {
      return;
    }

    $_route_ = $this->request->get['_route_'];

		$keywords = explode('/', $_route_);

		// remove any empty arrays from trailing
		if (utf8_strlen(end($keywords)) == 0) {
			array_pop($keywords);
		}

    $ignored = array();

    $page_keywords = array();

    // Get category path
    if (!$this->path) {
      $path_info = $this->model_catalog_ocfilter->decodeCategory($keywords);

      if ($path_info && $path_info->path) {
      	$this->path = $path_info->path;

        $ignored = $path_info->keywords;
      }
    }

    if (!$this->path) {
    	return;
    }

    $parts = explode('_', $this->path);

    $category_id = (int)end($parts);

    // Ignore language
    $key = array_search($this->session->data['language'], $keywords);

    if (false !== $key) {
    	$ignored[] = $keywords[$key];
    }

    // Get SEO Page
    foreach ($keywords as $key => $keyword) {
      if (in_array($keyword, $ignored)) {
      	continue;
      }

      $page_info = $this->model_catalog_ocfilter->decodePage($category_id, $keyword);

      if ($page_info) {
      	$this->page_info = $page_info;

  			$keywords = explode('/', $this->page_info['params']);

  			// remove any empty arrays from trailing
  			if (utf8_strlen(end($keywords)) == 0) {
  				array_pop($keywords);
  			}

        break;
      }
    }

    $params = array();

    // Special filters
    foreach ($keywords as $key => $keyword) {
      if (in_array($keyword, $ignored)) {
      	continue;
      }

      if ($keyword == 'price') {
        unset($keywords[$key++]);

        $page_keywords[] = $keyword;

        if (isset($keywords[$key]) && isRange($keywords[$key])) {
      	  $params['p'] = array($keywords[$key]);

          $page_keywords[] = $keywords[$key];

          unset($keywords[$key]);
        }
      } else if ($keyword == 'sklad' && $this->config->get('ocfilter_stock_status_method') == 'quantity') {
        unset($keywords[$key++]);

        $page_keywords[] = $keyword;

        if (isset($keywords[$key]) && ($keywords[$key] == 'in' || $keywords[$key] == 'out')) {
          if (!isset($params['s'])) {
            $params['s'] = array();
          }

          $params['s'][$keywords[$key]] = $keywords[$key];

          $page_keywords[] = $keywords[$key];

          unset($keywords[$key]);
        }
      }
    }

    $current = '';

    foreach ($keywords as $key => $keyword) {
      if (in_array($keyword, $ignored)) {
      	continue;
      }

      $founded = 0;

      // Values
      if ($current == 's' && isID($keyword) && $this->config->get('ocfilter_stock_status_method') == 'stock_status_id') {
        $params['s'][$keyword] = $keyword;

        $founded = 1;
      } else if ($current) {
        $value_id = $this->model_catalog_ocfilter->decodeValue($keyword, $current);

        if ($value_id) {
          $params[$current][$value_id] = $value_id;

          $founded = 1;
        } else if (isRange($keyword)) { // If Slider
          $params[$current][$keyword] = $keyword;

          $founded = 2;
        }
      }

      if ($founded > 0) {
        $page_keywords[] = $keyword;

        if ($founded > 1) {
        	$current = '';
        }

      	unset($keywords[$key]);

        continue;
      }

      // Options
      if ($keyword == 'sklad' && $this->config->get('ocfilter_stock_status_method') == 'stock_status_id') {
      	$params['s'] = array();

        $current = 's';

        $page_keywords[] = $keyword;

        unset($keywords[$key]);
      } else if (!isRange($keyword)) {
        $option_id = $this->model_catalog_ocfilter->decodeOption($keyword, $category_id);

        if ($option_id) {
          $params[$option_id] = array();

          $current = $option_id;

          $page_keywords[] = $keyword;

          unset($keywords[$key]);
        }
      }
    }

    // Manufacturer
    foreach ($keywords as $key => $keyword) {
      $manufacturer_id = $this->model_catalog_ocfilter->decodeManufacturer($keyword);

      if ($manufacturer_id) {
        if (!isset($params['m'])) {
          $params['m'] = array();
        }

       	$params['m'][$manufacturer_id] = $manufacturer_id;

        $page_keywords[] = $keyword;

        unset($keywords[$key]);
      }
    }

    // Add category SEO keywords to _route_
    if ($this->page_info) {
    	$path = $this->model_catalog_ocfilter->getCategorySeoPathByCategoryId($this->page_info['category_id']);

      if ($path) {
        $parts = explode('/', $path);

        foreach (array_reverse($parts) as $part) {
          array_unshift($keywords, $part);
        }
      }
    }

    if (!$this->page_info && $page_keywords) {
    	$this->page_info = $this->model_catalog_ocfilter->getPage($category_id, implode('/', $page_keywords));
    }

    if ($keywords) {
    	$this->request->get['_route_'] = implode('/', $keywords);
    }

    if ($params) {
      $this->request->get['filter_ocfilter'] = encodeParamsToString($params, $this->config);

      if (isset($this->request->get['route'])) {
      	unset($this->request->get['route']);
      } else {
        $this->request->get['route'] = 'product/category';
      }
    }
  }
    public function copyFilters() {
        
        set_time_limit(0);
        if ($_GET['truncate']==1){
        $data['copy_filter']=1;
        $data['copy_truncate']=1;
        $data['copy_attribute']=1;
        $data['copy_type']='checkbox';
        $data['ocfilter_attribute_separator']=':';
        $data['copy_store'][]='0';
        }
        $settings = array();
        $settings[30015]='checkbox';//sezon
        $settings[30014]='select';
        $settings[30013]='select';
        $settings[30012]='select';
        $settings[30016]='select';
        $settings[30028]='select';
        $settings[30033]='select';
        $settings[30034]='select';
        $settings[30036]='select';
        $settings[30019]='checkbox';//RunFlat
        $settings[30054]='checkbox';//Reinforced
        $settings[30022]='checkbox';//ship
        $settings[30023]='checkbox';//sezon
        $settings[30055]='select';//class
        
        $featured = $this->db->query("SELECT * FROM `" . DB_PREFIX . "module` WHERE `code` = 'featured'")->row;
        $featured_product = (array)json_decode($featured['setting']);

        $featured_product['product'] = array();
       
        $newfeatured = $this->db->query("SELECT * FROM `" . DB_PREFIX . "product_featured` pf left join product p on (pf.product_id=p.product_id) WHERE quantity>0")->rows;
        foreach ($newfeatured as $p) {
            $featured_product['product'][]=$p['product_id'];
        }

        //$data = (array)json_decode($featured);
        //$featured['setting']['product'] = $featured_product['product'];
        //$featured['setting'] = $featured_product;
        
        $this->db->query("UPDATE `" . DB_PREFIX . "module` SET setting='".$this->db->escape(json_encode($featured_product))."' WHERE `code` = 'featured'");

    if (!empty($data['copy_truncate'])) {
  		$this->db->query("TRUNCATE `" . DB_PREFIX . "ocfilter_option`");
      $this->db->query("TRUNCATE `" . DB_PREFIX . "ocfilter_option_description`");
      $this->db->query("TRUNCATE `" . DB_PREFIX . "ocfilter_option_to_category`");
      $this->db->query("TRUNCATE `" . DB_PREFIX . "ocfilter_option_to_store`");
      $this->db->query("TRUNCATE `" . DB_PREFIX . "ocfilter_option_value`");
      $this->db->query("TRUNCATE `" . DB_PREFIX . "ocfilter_option_value_to_product`");
      $this->db->query("TRUNCATE `" . DB_PREFIX . "ocfilter_option_value_description`");
      $this->db->query("update `" . DB_PREFIX . "product_attribute` set `text`='Летние' WHERE `text` LIKE 'летние';");
    }

    if (!empty($data['copy_option'])) {
      // Copy Product Options
      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option (option_id, `type`, `status`, sort_order, image) SELECT option_id, '" . $this->db->escape($data['copy_type']) . "', '1', sort_order, IF(`type` = 'image', 1, 0) FROM `" . DB_PREFIX . "option`");

      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_description (option_id, language_id, name) SELECT option_id, language_id, name FROM " . DB_PREFIX . "option_description");
      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value (value_id, option_id, image, sort_order) SELECT option_value_id, option_id, image, sort_order FROM " . DB_PREFIX . "option_value");

      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value_description (value_id,	option_id, language_id, name) SELECT option_value_id, option_id, language_id, name FROM " . DB_PREFIX . "option_value_description");
      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value_to_product (product_id, value_id, option_id) SELECT product_id, option_value_id, option_id FROM " . DB_PREFIX . "product_option_value WHERE quantity > '0'");
    }

    // Copy Product Filters
    $last_option_id = 10000;
    $last_value_id = 10000;

    if (!empty($data['copy_filter'])) {
      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option (option_id, `type`, `status`, sort_order) SELECT (filter_group_id + '" . (int)$last_option_id . "'), '" . $this->db->escape($data['copy_type']) . "', '1', sort_order FROM `" . DB_PREFIX . "filter_group`");

      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_description (option_id, language_id, name) SELECT (filter_group_id + '" . (int)$last_option_id . "'), language_id, name FROM " . DB_PREFIX . "filter_group_description");

      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value (value_id, option_id, sort_order) SELECT (filter_id + '" . (int)$last_value_id . "'), (filter_group_id + '" . (int)$last_option_id . "'), sort_order FROM " . DB_PREFIX . "filter");

      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value_description (value_id,	option_id, language_id, name) SELECT (filter_id + '" . (int)$last_value_id . "'), (filter_group_id + '" . (int)$last_option_id . "'), language_id, name FROM " . DB_PREFIX . "filter_description");

      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value_to_product (product_id, value_id, option_id) SELECT pf.product_id, (pf.filter_id + '" . (int)$last_value_id . "'), (SELECT oov.option_id FROM " . DB_PREFIX . "ocfilter_option_value oov WHERE oov.value_id = (pf.filter_id + '" . (int)$last_value_id . "')) AS option_id FROM " . DB_PREFIX . "product_filter pf");
    }

    if (!empty($data['copy_attribute'])) {
      $this->db->query("UPDATE " . DB_PREFIX . "product_attribute SET text = TRIM(text)");

      $last_option_id *= 3;
      $last_value_id *= 3;

      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option (option_id, status, type, sort_order)      SELECT (attribute_id + '" . (int)$last_option_id . "'), '1' AS status, '" . $this->db->escape($data['copy_type']) . "' AS type, sort_order FROM " . DB_PREFIX . "attribute");
      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_description (option_id, language_id, name) SELECT (attribute_id + '" . (int)$last_option_id . "'), language_id, name FROM " . DB_PREFIX . "attribute_description");

  		$this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value (option_id, value_id)                                SELECT (attribute_id + '" . (int)$last_option_id . "'), CRC32(CONCAT(attribute_id, CONCAT(UCASE(LEFT(TRIM(text), 1)), LCASE(SUBSTRING(TRIM(text), 2)))))                          FROM " . DB_PREFIX . "product_attribute WHERE language_id = '" . (int)$this->config->get('config_language_id') . "' GROUP BY attribute_id, CONCAT(UCASE(LEFT(TRIM(text), 1)), LCASE(SUBSTRING(TRIM(text), 2)))");
  		$this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value_description (option_id, value_id, language_id, name) SELECT (attribute_id + '" . (int)$last_option_id . "'), CRC32(CONCAT(attribute_id, CONCAT(UCASE(LEFT(TRIM(text), 1)), LCASE(SUBSTRING(TRIM(text), 2))))), language_id, TRIM(text) FROM " . DB_PREFIX . "product_attribute WHERE language_id = '" . (int)$this->config->get('config_language_id') . "' GROUP BY attribute_id, CONCAT(UCASE(LEFT(TRIM(text), 1)), LCASE(SUBSTRING(TRIM(text), 2)))");

      $this->load->model('localisation/language');

      $languages = $this->model_localisation_language->getLanguages();

      foreach ($languages as $language) {
        if ($language['language_id'] != $this->config->get('config_language_id')) {
      		$this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value_description (option_id, value_id, language_id, name)

          SELECT
            (pa.attribute_id + '" . (int)$last_option_id . "'),
            (SELECT
              CRC32(CONCAT(pa2.attribute_id, CONCAT(UCASE(LEFT(TRIM(pa2.text), 1)), LCASE(SUBSTRING(TRIM(pa2.text), 2))))) FROM " . DB_PREFIX . "product_attribute pa2
              WHERE pa2.language_id = '" . (int)$this->config->get('config_language_id') . "'
              AND pa2.product_id = pa.product_id
              AND pa2.attribute_id = pa.attribute_id LIMIT 1
            ) AS value_id, '" . (int)$language['language_id'] . "', CONCAT(UCASE(LEFT(TRIM(pa.text), 1)), LCASE(SUBSTRING(TRIM(pa.text), 2)))
          FROM " . DB_PREFIX . "product_attribute pa WHERE pa.language_id = '" . (int)$language['language_id'] . "' GROUP BY pa.attribute_id, CONCAT(UCASE(LEFT(TRIM(pa.text), 1)), LCASE(SUBSTRING(TRIM(pa.text), 2)))");
        }
      }

      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_value_to_product (product_id, option_id, value_id) SELECT product_id, (attribute_id + '" . (int)$last_option_id . "'), CRC32(CONCAT(attribute_id, CONCAT(UCASE(LEFT(TRIM(text), 1)), LCASE(SUBSTRING(TRIM(text), 2))))) AS value_id FROM " . DB_PREFIX . "product_attribute WHERE language_id = '" . (int)$this->config->get('config_language_id') . "'");

      // Separate
      if (!empty($data['ocfilter_attribute_separator'])) {
      	$separator = (string)$data['ocfilter_attribute_separator'];

        $query = $this->db->query("SELECT * FROM " . DB_PREFIX . "ocfilter_option_value_description WHERE language_id = '" . (int)$this->config->get('config_language_id') . "' AND TRIM(name) LIKE '%" . $this->db->escape($separator) . "%'");

        foreach ($query->rows as $result) {
        	$values = explode($separator, $result['name']);

          foreach ($values as $value) {
            $value = $this->utf8_ucfirst(trim($value));

            if (!$value) {
              continue;
            }

            $value_query = $this->db->query("SELECT value_id FROM " . DB_PREFIX . "ocfilter_option_value_description WHERE language_id = '" . (int)$this->config->get('config_language_id') . "' AND option_id = '" . (int)$result['option_id'] . "' AND LCASE(TRIM(name)) = '" . $this->db->escape(utf8_strtolower($value)) . "'");

            if ($value_query->num_rows) {
              $value_id = $value_query->row['value_id'];
            } else {
        		  $this->db->query("INSERT INTO " . DB_PREFIX . "ocfilter_option_value (option_id) VALUES ('" . (int)$result['option_id'] . "')");

              $value_id = $this->db->getLastId();

              $this->db->query("INSERT INTO " . DB_PREFIX . "ocfilter_option_value_description (option_id, value_id, language_id, name) VALUES ('" . (int)$result['option_id'] . "', '" . $this->db->escape($value_id) . "', '" . (int)$this->config->get('config_language_id') . "', '" . $this->db->escape($value) . "')");
            }

            $this->db->query("INSERT INTO " . DB_PREFIX . "ocfilter_option_value_to_product (product_id, option_id, value_id) SELECT oov2p.product_id, '" . (int)$result['option_id'] . "', '" . $this->db->escape($value_id) . "' FROM " . DB_PREFIX . "ocfilter_option_value_to_product oov2p WHERE oov2p.option_id = '" . (int)$result['option_id'] . "' AND oov2p.value_id = '" . $this->db->escape($result['value_id']) . "'");
          }

          if ($values) {
            $this->db->query("DELETE FROM `" . DB_PREFIX . "ocfilter_option_value` WHERE value_id = '" . $this->db->escape($result['value_id']) . "'");
            $this->db->query("DELETE FROM `" . DB_PREFIX . "ocfilter_option_value_description` WHERE language_id = '" . (int)$this->config->get('config_language_id') . "' AND value_id = '" . $this->db->escape($result['value_id']) . "'");
            $this->db->query("DELETE FROM `" . DB_PREFIX . "ocfilter_option_value_to_product` WHERE option_id = '" . (int)$result['option_id'] . "' AND value_id = '" . $this->db->escape($result['value_id']) . "'");
          }
        }
      }
    }

    if (/*!empty($data['copy_option']) ||*/ !empty($data['copy_filter']) || !empty($data['copy_attribute'])) {
      // Common
      $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category (option_id, category_id) SELECT oov2p.option_id, p2c.category_id FROM " . DB_PREFIX . "ocfilter_option_value_to_product oov2p LEFT JOIN " . DB_PREFIX . "product_to_category p2c ON (p2c.product_id = oov2p.product_id) WHERE p2c.category_id != '0' GROUP BY oov2p.option_id, p2c.category_id");

      foreach ($data['copy_store'] as $store_id) {
        $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_store (option_id, store_id) SELECT option_id, '" . (int)$store_id . "' AS store_id FROM " . DB_PREFIX . "ocfilter_option");
      }

      $option_query = $this->db->query("SELECT * FROM " . DB_PREFIX . "ocfilter_option WHERE status = '1' AND (type = 'slide' OR type = 'slide_dual')");

      foreach ($option_query->rows as $option) {
        $value_query = $this->db->query("SELECT * FROM " . DB_PREFIX . "ocfilter_option_value_description WHERE option_id = '" . (int)$option['option_id'] . "' AND language_id = '" . (int)$this->config->get('config_language_id') . "'");

        foreach ($value_query->rows as $value) {
          $slide_value_min = (float)preg_replace('![^0-9\.\-]+!s', '', $value['name']);

          if ($slide_value_min) {//value_id = '0',
    		    $this->db->query("UPDATE IGNORE " . DB_PREFIX . "ocfilter_option_value_to_product SET  slide_value_min = '" . (float)$slide_value_min . "', slide_value_max = '" . (float)$slide_value_min . "' WHERE option_id = '" . (int)$value['option_id'] . "' AND value_id = '" . (string)$value['value_id'] . "'");
          }
        }
      }
      //dopuski
            $option_query = $this->db->query("SELECT * FROM " . DB_PREFIX . "ocfilter_option WHERE status = '1' AND option_id in (30012,30034,30036)");

      foreach ($option_query->rows as $option) {
        $value_query = $this->db->query("SELECT * FROM " . DB_PREFIX . "ocfilter_option_value_description WHERE option_id = '" . (int)$option['option_id'] . "' AND language_id = '" . (int)$this->config->get('config_language_id') . "'");

        foreach ($value_query->rows as $value) {
          $slide_value_min = (float)preg_replace('![^0-9\.\-]+!s', '', $value['name']);

          if ($slide_value_min) {//value_id = '0',
    		    $this->db->query("UPDATE IGNORE " . DB_PREFIX . "ocfilter_option_value_to_product SET  slide_value_min = '" . (float)$slide_value_min . "', slide_value_max = '" . (float)$slide_value_min . "' WHERE option_id = '" . (int)$value['option_id'] . "' AND value_id = '" . (string)$value['value_id'] . "'");
          }
        }
      }
      
    }

    // Set URL Aliases
    $query = $this->db->query("SELECT oov.value_id, oovd.name FROM " . DB_PREFIX . "ocfilter_option_value oov LEFT JOIN " . DB_PREFIX . "ocfilter_option_value_description oovd ON(oov.value_id = oovd.value_id) WHERE oovd.language_id = '" . (int)$this->config->get('config_language_id') . "' AND oov.`keyword` = ''");

    foreach ($query->rows as $row) {
    	$this->db->query("UPDATE " . DB_PREFIX . "ocfilter_option_value SET `keyword` = '" . $this->db->escape($this->translit($row['name'])) . "' WHERE value_id = '" . $this->db->escape($row['value_id']) . "'");
    }
    
    $this->db->query("DELETE FROM " . DB_PREFIX . "ocfilter_option_to_category WHERE option_id = '30015'");

    $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category SET option_id = '30015', category_id = '59'");
    
    $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category SET option_id = '30015', category_id = '61'");
    
 
    $this->db->query("DELETE FROM " . DB_PREFIX . "ocfilter_option_to_category WHERE option_id = '30028';");

    $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category SET option_id = '30028', category_id = '59'");
    
    $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category SET option_id = '30028', category_id = '62'");
    
    $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category SET option_id = '30014', category_id = '65'"); 
    $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category SET option_id = '30023', category_id = '65'"); 
    $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category SET option_id = '30014', category_id = '66'"); 
    $this->db->query("INSERT IGNORE INTO " . DB_PREFIX . "ocfilter_option_to_category SET option_id = '30023', category_id = '66'");     
    
    	$this->db->query("TRUNCATE `" . DB_PREFIX . "ocfilter_option`");
        $this->db->query("INSERT INTO `" . DB_PREFIX . "ocfilter_option` (`option_id`, `type`, `keyword`, `selectbox`, `grouping`, `color`, `image`, `status`, `sort_order`) VALUES
(10001,	'checkbox',	'tip-trasportnogo-sredstva',	1,	0,	0,	0,	1,	1),
(10002,	'checkbox',	'sfera-deyatelnosti',	1,	0,	0,	0,	1,	0),
(30012,	'checkbox',	'shirina',	1,	0,	0,	0,	1,	3),
(30013,	'checkbox',	'profil',	1,	0,	0,	0,	1,	4),
(30014,	'checkbox',	'diametr',	1,	0,	0,	0,	1,	5),
(30015,	'checkbox',	'sezonnost',	1,	0,	0,	0,	1,	8),
(30016,	'select',	'podkategorija',	0,	0,	0,	0,	1,	1),
(30017,	'checkbox',	'indeks-nagruzki',	0,	0,	0,	0,	0,	6),
(30018,	'checkbox',	'indeks-skorosti',	0,	0,	0,	0,	0,	7),
(30019,	'checkbox',	'tehnologija-runflat',	0,	0,	0,	0,	1,	11),
(30020,	'checkbox',	'tehnologija-extraload',	0,	0,	0,	0,	0,	10),
(30021,	'checkbox',	'tehnologija-flange-protector',	0,	0,	0,	0,	0,	12),
(30022,	'checkbox',	'nalichie-shipov',	0,	0,	0,	0,	1,	9),
(30023,	'checkbox',	'razmer',	1,	0,	0,	0,	1,	2),
(30024,	'checkbox',	'euro-1',	0,	0,	0,	0,	0,	13),
(30025,	'checkbox',	'euro-2',	0,	0,	0,	0,	0,	14),
(30026,	'checkbox',	'euro-3',	0,	0,	0,	0,	0,	15),
(30027,	'checkbox',	'strana-pr-va',	0,	0,	0,	0,	0,	17),
(30028,	'checkbox',	'os',	1,	0,	0,	0,	1,	2),
(30033,	'select',	'pcd',	0,	0,	0,	0,	1,	5),
(30034,	'select',	'vylet-et-',	0,	0,	0,	0,	1,	6),
(30036,	'select',	'stupitsa-dia-',	0,	0,	0,	0,	1,	7),
(30037,	'checkbox',	'tsvet',	0,	0,	0,	0,	0,	9),
(30038,	'checkbox',	'kamernye',	0,	0,	0,	0,	0,	0),
(30039,	'checkbox',	'omologatsija',	0,	0,	0,	0,	0,	16),
(30041,	'checkbox',	'dopusk-shiny',	0,	0,	0,	0,	0,	11),
(30042,	'checkbox',	'diam.-tsent.-otv.-ch-',	0,	0,	0,	0,	0,	8),
(30043,	'checkbox',	'retread',	0,	0,	0,	0,	0,	0),
(30044,	'checkbox',	'naznachenie',	0,	0,	0,	0,	0,	99),
(30045,	'checkbox',	'konstruktsija',	0,	0,	0,	0,	0,	99),
(30046,	'checkbox',	'sposob-germetizatsii',	0,	0,	0,	0,	0,	99),
(30047,	'checkbox',	'vozmozhnost-oshipovki',	0,	0,	0,	0,	0,	99),
(30048,	'checkbox',	'run-flat',	0,	0,	0,	0,	0,	99),
(30049,	'checkbox',	'indeks-nagruzki-dvojnogo-kolesa',	0,	0,	0,	0,	0,	99),
(30050,	'checkbox',	'norma-slojnosti',	0,	0,	0,	0,	0,	99),
(30051,	'checkbox',	'data-vyhoda-na-rynok',	0,	0,	0,	0,	0,	99),
(30052,	'checkbox',	'vneshnij-diametr-shiny',	0,	0,	0,	0,	0,	99),
(30053,	'checkbox',	'indeks-skorosti-dvojnogo-kolesa',	0,	0,	0,	0,	0,	0),
(30054,	'checkbox',	'tehnologija-reinforced',	0,	0,	0,	0,	1,	18),
(30055,	'select',	'klass-shiny',	0,	0,	0,	0,	0,	0),
(30056,	'checkbox',	'kategorija-shiny',	0,	0,	0,	0,	0,	0),
(30058,	'checkbox',	'nalichie-zimnej-markirovki',	0,	0,	0,	0,	0,	0),
(30062,	'checkbox',	'razmer-diska',	0,	0,	0,	0,	0,	0),
(30063,	'checkbox',	'rasprodazha',	0,	0,	0,	0,	1,	0),
(30064,	'checkbox',	'shinomontag',	0,	0,	0,	0,	1,	0),
(30065,	'checkbox',	'pcs',	0,	0,	0,	0,	1,	0),
(30074,	'checkbox',	'prigodnaya-k-vosstanovleniyu',	0,	0,	0,	0,	0,	0),
(30075,	'checkbox',	'vid-dejatelnosti',	0,	0,	0,	0,	0,	0),
(30076,	'checkbox',	'index-prochnosti',	0,	0,	0,	0,	0,	0),
(30077,	'checkbox',	'glubina-risunka-protectora',	0,	0,	0,	0,	0,	0),
(30082,	'checkbox',	'tehnologiya-contiseal',	0,	0,	0,	0,	0,	0),
(30083,	'checkbox',	'tehnologiya-contisilent',	0,	0,	0,	0,	0,	0),
(30085,	'checkbox',	'3pmsf',	0,	0,	0,	0,	0,	0),
(30086,	'checkbox',	'm-s',	0,	0,	0,	0,	0,	0)
");
//vnedorojnie
$this->db->query("INSERT IGNORE INTO ocfilter_option SET status = '0', sort_order = '0', type = 'radio', selectbox = '0', color = '0', image = '0', `keyword` = 'vnedorojnie'");
if ($_GET['truncate']==1){
$last_id = $this->db->getLastId();
$this->db->query("INSERT IGNORE INTO ocfilter_option_description SET option_id = '".$last_id."', language_id = '1', name = 'Внедорожные', description = '', postfix = ''");

$this->db->query("INSERT IGNORE INTO ocfilter_option_to_category SET option_id = '".$last_id."', category_id = '61'");

$this->db->query("INSERT IGNORE INTO ocfilter_option_to_store SET option_id = '".$last_id."', store_id = '0'");

$this->db->query("INSERT IGNORE INTO ocfilter_option_value SET option_id = '".$last_id."', sort_order = '0', `keyword` = 'da', color = '', image = ''");
$last_v_id = $this->db->getLastId();
$this->db->query("INSERT IGNORE INTO ocfilter_option_value_description SET value_id = '".$last_v_id."', option_id = '".$last_id."', language_id = '1', name = 'да'");

$products = $this->db->query("SELECT product_id FROM `product_description` WHERE `name` LIKE '% suv%' or `name` LIKE '%4x4%' or `name` LIKE '%Terrain%' or `name` LIKE '%Wrangler%'")->rows;
foreach($products as $p) {
    $this->db->query("INSERT INTO ocfilter_option_value_to_product SET value_id = '".$last_v_id."', option_id = '".$last_id."', product_id = '".$p['product_id']."'");
}
}
  
//Распродажа
$this->db->query("DELETE FROM ocfilter_option_value_to_product WHERE option_id = 30063");
//$this->db->query("INSERT IGNORE INTO ocfilter_option SET status = '1', sort_order = '0', type = 'checkbox', selectbox = '0', color = '0', image = '0', `keyword` = 'rasprodazha'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_description SET option_id = '30063', language_id = '1', name = 'Распродажа', description = '', postfix = ''");
$this->db->query("INSERT IGNORE INTO ocfilter_option_to_category SET option_id = '30063', category_id = '61'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_to_store SET option_id = '30063', store_id = '0'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_value SET value_id = '4289666626', option_id = '30063', sort_order = '0', `keyword` = 'rasprodazha', color = '', image = ''");
$this->db->query("INSERT IGNORE INTO ocfilter_option_value_description SET value_id = '4289666626', option_id = '30063', language_id = '1', name = 'Распродажа'");

$sql="SELECT p.product_id, p.price, p.price2, p.price3, s.price as special FROM ".DB_PREFIX."product_special s 
left join product p on (p.product_id=s.product_id) 
left join product_to_category c on (p.product_id=c.product_id and c.category_id=61) 
WHERE p.status=1 and c.category_id=61";
$products = $this->db->query($sql);
//Special!!!
  foreach ($products->rows as $p) {
        $this->db->query("INSERT IGNORE INTO ocfilter_option_value_to_product SET value_id = 4289666626, option_id = 30063, product_id = '".$p['product_id']."'");
  }
  
//shinomontag
$this->db->query("DELETE FROM ocfilter_option_value_to_product WHERE option_id = 30064");
//$this->db->query("INSERT IGNORE INTO ocfilter_option SET status = '1', sort_order = '0', type = 'checkbox', selectbox = '0', color = '0', image = '0', `keyword` = 'shinomontag'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_description SET option_id = '30064', language_id = '1', name = 'Шиномонтаж в подарок', description = '', postfix = ''");
$this->db->query("INSERT IGNORE INTO ocfilter_option_to_category SET option_id = '30064', category_id = '61'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_to_store SET option_id = '30064', store_id = '0'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_value SET value_id = '4289666627', option_id = '30064', sort_order = '0', `keyword` = 'v-podarok', color = '', image = ''");
$this->db->query("INSERT IGNORE INTO ocfilter_option_value_description SET value_id = '4289666627', option_id = '30064', language_id = '1', name = 'Шиномонтаж в подарок'");

$sql="INSERT IGNORE INTO ".DB_PREFIX."ocfilter_option_value_to_product (value_id, option_id, product_id)
SELECT 4289666627, 30064, p.product_id FROM ".DB_PREFIX."product p 
left join manufacturer m on (p.manufacturer_id=m.manufacturer_id) 
left join product_to_category c on (p.product_id=c.product_id and c.category_id=61) 
WHERE m.yomenu_image!='' and p.status=1 and c.category_id=61";
$products = $this->db->query($sql);
  
//kupit-1-pcs
$this->db->query("DELETE FROM ocfilter_option_value_to_product WHERE option_id = 30065");  
//$this->db->query("INSERT IGNORE INTO ocfilter_option SET status = '1', sort_order = '0', type = 'checkbox', selectbox = '0', color = '0', image = '0', `keyword` = 'pcs'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_description SET option_id = '30065', language_id = '1', name = 'Купить 1 штуку', description = '', postfix = ''");
$this->db->query("INSERT IGNORE INTO ocfilter_option_to_category SET option_id = '30065', category_id = '61'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_to_store SET option_id = '30065', store_id = '0'");
$this->db->query("INSERT IGNORE INTO ocfilter_option_value SET value_id = '4289666628', option_id = '30065', sort_order = '0', `keyword` = 'pcs-1', color = '', image = ''");
$this->db->query("INSERT IGNORE INTO ocfilter_option_value_description SET value_id = '4289666628', option_id = '30065', language_id = '1', name = 'Купить 1 штуку'");

$sql="SELECT p.product_id, p.quantity FROM ".DB_PREFIX."product p 
left join product_to_category c on (p.product_id=c.product_id and c.category_id=61) 
WHERE p.quantity=1 and p.status=1 and c.category_id=61";
$products = $this->db->query($sql);
  foreach ($products->rows as $p) {
        $this->db->query("INSERT IGNORE INTO ocfilter_option_value_to_product SET value_id = 4289666628, option_id = 30065, product_id = '".$p['product_id']."'");
  }  

    //$this->load->controller('tool/koleso/searchindex');
    $this->cache->delete('ocfilter');
    
    //file_put_contents(PATH.'ocfilter.txt','qwe');
    //header('Location: //'.HOST.'/index.php?route=extension/module/cachemanager/clearallcache');
    
    echo 'ok';
    //return false;
  }

  public function translit($string) {
    $replace = array(
      'а' => 'a',
  		'б' => 'b',
      'в' => 'v',
  		'г' => 'g',
      'ґ' => 'g',
  		'д' => 'd',
  		'е' => 'e',
      'є' => 'je',
  		'ё' => 'e',
  		'ж' => 'zh',
      'з' => 'z',
  		'и' => 'i',
      'і' => 'i',
      'ї' => 'ji',
  		'й' => 'j',
  		'к' => 'k',
  		'л' => 'l',
      'м' => 'm',
  		'н' => 'n',
  		'о' => 'o',
  		'п' => 'p',
  		'р' => 'r',
      'с' => 's',
  		'т' => 't',
  		'у' => 'u',
  		'ф' => 'f',
  		'х' => 'h',
      'ц' => 'ts',
  		'ч' => 'ch',
  		'ш' => 'sh',
  		'щ' => 'sch',
  		'ъ' => '',
      'ы' => 'y',
  		'ь' => '',
  		'э' => 'e',
  		'ю' => 'ju',
  		'я' => 'ja',

  		' ' => '-',
      '+' => 'plus'
    );

    $string = mb_strtolower($string, 'UTF-8');
    $string = strtr($string, $replace);
    $string = preg_replace('![^\\.a-zа-яёйъ0-9]+!isu', '-', $string);
  	$string = preg_replace('!\-{2,}!si', '-', $string);

  	return $string;
  }
  public function rewrite($link) {
    //if ($this->cache_links[$link])
    //return $this->cache_links[$link];
    $url_info = parse_url(str_replace('&amp;', '&', $link));

    if (!isset($url_info['query'])) {
    	return $link;
    }

		$data = array();

		parse_str($url_info['query'], $data);

    if (!isset($data['filter_ocfilter'])) {
      return $link;
    }

    $params = decodeParamsFromString($data['filter_ocfilter'], $this->config);

    unset($data['filter_ocfilter']);

    $path = '';

    foreach ($params as $option_id => $values) {
      if ($option_id == 'p') {
      	$path .= '/price';
      } else if ($option_id == 's') {
      	$path .= '/sklad';
      } else if ($option_id != 'm') {
        if (!isset($this->cache_sql[(int)$option_id])) {
        $query = $this->db->query("SELECT keyword FROM " . DB_PREFIX . "ocfilter_option WHERE option_id = '" . (int)$option_id . "'");

        if ($query->num_rows && $query->row['keyword']) {
        	$path .= '/' . $query->row['keyword'];
        } else {
        	$path .= '/' . $option_id;
        }
        //$this->cache_sql[(int)$option_id]=$path;
        } else {
            $path = $this->cache_sql[(int)$option_id];
        }
      }

      foreach ($values as $value_id) {
        if (!isset($this->cache_sql[$option_id.(string)$value_id])) {
        $query = false;

        if ($option_id == 'm') {
          $query = $this->db->query("SELECT keyword FROM " . DB_PREFIX . "url_alias WHERE `query` = 'manufacturer_id=" . (int)$value_id . "'");
        } else if (isID($value_id)) {
          $query = $this->db->query("SELECT keyword FROM " . DB_PREFIX . "ocfilter_option_value WHERE value_id = '" . $this->db->escape((string)$value_id) . "'");
        }

        if ($query && $query->num_rows && $query->row['keyword']) {
        	$path .= '/' . $query->row['keyword'];
        } else {
        	$path .= '/' . $value_id;
        }
        //$this->cache_sql[$option_id.(string)$value_id]=$path;
      } else {
        $path = $this->cache_sql[$option_id.(string)$value_id];
      }
      }
    }

    if ($path) {
      $page_path = ltrim($path, '/');
    if (!isset($this->cache_page[$this->category_id.'-'.$page_path])) {
      $page_info = $this->model_catalog_ocfilter->getPage($this->category_id, $page_path);
      //$this->cache_page[$this->category_id.'-'.$page_path]=$page_info;
      } else {
      $page_info =  $this->cache_page[$this->category_id.'-'.$page_path];
      }
      
      if ($page_info && $page_info['keyword']) {
      	$path = '/' . $page_info['keyword'];
      }
    }

    $rewrite = $url_info['scheme'] . '://' . $url_info['host'];

    if (isset($url_info['port'])) {
    	$rewrite .= ':' . $url_info['port'];
    }

    if (isset($url_info['path'])) {
    	$rewrite .= str_replace('/index.php', '', $url_info['path']);
    } else {
      $rewrite .= '/index.php';
    }

    if ($path) {
    	$rewrite = rtrim($rewrite, '/') . $path;

      if ($this->config->has('config_seo_url_type') && $this->config->get('config_seo_url_type') == 'seo_pro') {
      	$rewrite .= '/';
      }
    }

		$query = '';

		if ($data) {
			foreach ($data as $key => $value) {
				$query .= '&' . rawurlencode((string)$key) . '=' . rawurlencode((is_array($value) ? http_build_query($value) : (string)$value));
			}

			if ($query) {
				$query = '?' . str_replace('&', '&amp;', trim($query, '&'));
			}
		}

    $rewrite .= $query;
//$this->cache_links[$link]=$rewrite;
		return $rewrite;
  }

  public function getPageInfo() {
    return $this->page_info;
  }

  public function getSelectedsFilterTitle() {
    $filter_title = '';

    $selecteds = $this->getSelectedOptions();

    foreach ($selecteds as $option_id => $option) {
      if ($filter_title) {
        $filter_title .= ', ';
      }

      if ($option_id == 'm') {
        $values_name  = '';

        foreach ($option['values'] as $value) {
          if ($values_name) {
          	$values_name .= ', ';
          }

      	  $values_name .= $value['name'];
        }

        if ($values_name) {
        	$filter_title .= $values_name;
        }
      } else if ($option_id == 'p') {
        $price = array_shift($option['values']);

        $filter_title .= $price['name'];
      } else if ($option_id == 's') {
        if ($this->config->get('ocfilter_stock_status_method') == 'quantity') {
          $stock_status = array_shift($option['values']);

          if ($stock_status['name'] == 'in') {
            $filter_title .= 'в наличии';
          } else if ($stock_status['name'] == 'out') {
            $filter_title .= 'нет в наличии';
          }
        } else {
          $values_name  = '';

          foreach ($option['values'] as $value) {
            if ($values_name) {
            	$values_name .= ', ';
            }

        	  $values_name .= $value['name'];
          }

          if ($values_name) {
          	$filter_title .= $values_name;
          }
        }
      } else {
        $values_name  = '';

        foreach ($option['values'] as $value) {
          if ($values_name) {
          	$values_name .= ', ';
          }

      	  $values_name .= $value['name'];
        }

        if ($values_name) {
        	$filter_title .= $option['name'] . ' ' . $values_name;
        }
      }
    }

    return $filter_title;
  }

  protected function link($filter_ocfilter = '') {
    $url = '';

    if ($this->path) {
      $url .= '&path=' . (string)$this->path;
    }

    if ($filter_ocfilter) {
      $url .= '&filter_ocfilter=' . (string)$filter_ocfilter;
    }

    if (isset($this->request->get['sort'])) {
      $url .= '&sort=' . (string)$this->request->get['sort'];
    }

    if (isset($this->request->get['order'])) {
      $url .= '&order=' . (string)$this->request->get['order'];
    }

    if (isset($this->request->get['limit'])) {
      $url .= '&limit=' . (int)$this->request->get['limit'];
    }

    return $this->url->link('product/category', $url);
  }

  public function callback() {
    if (!$this->path) {
    	return;
    }

    $this->load->language('extension/module/ocfilter');

    $json = array();

    if (isset($this->request->get['option_id'])) {
    	$option_id = $this->request->get['option_id'];
    } else {
    	$option_id = 0;
    }

    $filter_data = array(
			'filter_category_id' => $this->category_id,
      'filter_ocfilter' => $this->params,
      'limit' => 1,
		);

    if ($this->config->get('ocfilter_sub_category')) {
    	$filter_data['filter_sub_category'] = true;
    }

		$total_products = $this->model_catalog_product->getTotalProducts($filter_data);

    $json['total'] = $total_products;
    $json['text_total'] = declOfNum($total_products, array(
                                      $this->language->get('button_show_total_1'),
                                      $this->language->get('button_show_total_2'),
                                      $this->language->get('button_show_total_3')
                                    ));

    $json['values'] = array();
    $json['sliders'] = array();

    if ($this->config->get('ocfilter_show_price') && $option_id != 'p') {
      $_filter_data = $filter_data;

      $_filter_data['filter_ocfilter'] = $this->cancelOptionParams('p');

      $product_prices = $this->model_catalog_ocfilter->getProductPrices($_filter_data);

      if ($product_prices) {
        $json['sliders']['p'] = array(
          'min' => $this->currency->format(floor($product_prices['min']), $this->session->data['currency'], '', false),
          'max' => $this->currency->format(ceil($product_prices['max']), $this->session->data['currency'], '', false),
        );
      }
    }

    $options = $this->getOCFilterOptions();

    foreach ($options as $option) {
      if ($option['type'] == 'slide' || $option['type'] == 'slide_dual') {
        if ($option['option_id'] != $option_id) {
          $json['sliders'][$option['option_id']] = $this->model_catalog_ocfilter->getSliderRange($option['option_id'], $filter_data);
        }

        continue;
      }

      if ($option['type'] == 'select' || $option['type'] == 'radio') {
        $params = $this->cancelOptionParams($option['option_id']);

        $json['values']['cancel-' . $option['option_id']] = array(
          't' => 1,
          'p' => $params,
					's' => false
        );
			}

      foreach ($option['values'] as $value) {
        $json['values'][$value['id']] = array(
          't' => $value['count'],
          'p' => $value['params'],
					's' => isset($this->options_get[$option['option_id']][$value['value_id']])
        );
      }
    }

    $json['href'] = str_replace('&amp;', '&', $this->link($this->params));

		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
  }
}
?>