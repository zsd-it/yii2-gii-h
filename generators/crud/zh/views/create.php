<?php

use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $generator zh\gii\generators\crud\Generator */

echo "<?php\n";
?>

/* @var $this yii\web\View */
/* @var $model <?= ltrim($generator->modelClass, '\\') ?> */

$this->title = <?= $generator->generateString('创建' . $generator->getTableComments()) ?>;
$this->params['breadcrumbs'][] = ['label' => '<?= $generator->getTableComments() ?>列表', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="<?= Inflector::camel2id(StringHelper::basename($generator->modelClass)) ?>-create col-sm-12">
	<div class=" ibox ibox-content" style="margin-top: 15px;">
    <?= "<?= " ?>$this->render('_form', [
        'model' => $model,
    ]) ?>
	</div>
</div>
